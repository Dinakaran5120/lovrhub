import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { JwtPayload } from '@/common/decorators/current-user.decorator';
import { RedisService } from '@/redis/redis.service';
import { ConversationsService } from '@/modules/conversations/conversations.service';
import { MessagesService } from '@/modules/conversations/messages.service';
import { MessageType } from '@prisma/client';
import { PresenceService } from './presence.service';
import { TypingService } from './typing.service';

interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  /**
   * Maps userId → Set of socket IDs (a user may have multiple browser tabs).
   */
  private readonly userSocketMap = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly presenceService: PresenceService,
    private readonly typingService: TypingService,
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  // ---------------------------------------------------------------------------
  // Lifecycle hooks
  // ---------------------------------------------------------------------------

  afterInit(server: Server): void {
    this.logger.log('ChatGateway initialized');

    // Attach Redis pub/sub adapter for horizontal scaling
    const redisClient = this.redisService.getClient();
    const redisUrl = this.configService.get<string>(
      'redis.url',
      'redis://localhost:6379',
    );
    const pubClient = new Redis(redisUrl);
    const subClient = pubClient.duplicate();

    server.adapter(createAdapter(pubClient, subClient));
    this.logger.log('Socket.IO Redis adapter attached');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Connection rejected – no token (socket ${client.id})`);
        client.emit('error', { message: 'Authentication token not provided' });
        client.disconnect(true);
        return;
      }

      let payload: JwtPayload;
      try {
        payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      } catch (err: any) {
        const message =
          err?.name === 'TokenExpiredError'
            ? 'Authentication token has expired'
            : 'Authentication token is invalid';
        client.emit('error', { message });
        client.disconnect(true);
        return;
      }

      // Attach user data to socket
      (client as AuthenticatedSocket).data.user = payload;

      const userId = payload.sub;

      // Register socket in map
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, new Set());
      }
      this.userSocketMap.get(userId)!.add(client.id);

      // Join personal room for targeted messages
      await client.join(`user:${userId}`);

      // Set online presence
      await this.presenceService.setOnline(userId);

      // Broadcast to match partners
      await this.presenceService.broadcastPresence(this.server, userId, true);

      this.logger.log(`Client connected: socket=${client.id} userId=${userId}`);
    } catch (err) {
      this.logger.error(`handleConnection error: ${(err as Error).message}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = (client as AuthenticatedSocket).data?.user?.sub;
    if (!userId) return;

    const sockets = this.userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSocketMap.delete(userId);
        // No more sockets for this user → set offline
        await this.presenceService.setOffline(userId);
        await this.presenceService.broadcastPresence(this.server, userId, false);
        this.logger.log(`User fully disconnected: userId=${userId}`);
      }
    }

    this.logger.log(`Socket disconnected: socket=${client.id} userId=${userId}`);
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  @SubscribeMessage('conversation:join')
  async handleJoinConversation(
    client: AuthenticatedSocket,
    payload: { conversationId: string },
  ): Promise<void> {
    const userId = client.data.user.sub;
    const { conversationId } = payload;

    if (!conversationId) {
      throw new WsException('conversationId is required');
    }

    // Verify participant
    try {
      await this.conversationsService.getConversationById(conversationId, userId);
    } catch {
      throw new WsException('Not a participant of this conversation');
    }

    await client.join(`conversation:${conversationId}`);

    // Mark existing messages as read
    const readCount = await this.messagesService.markConversationRead(
      conversationId,
      userId,
    );

    client.emit('conversation:joined', { conversationId, readCount });

    this.logger.debug(`userId=${userId} joined conversation:${conversationId}`);
  }

  @SubscribeMessage('conversation:leave')
  async handleLeaveConversation(
    client: AuthenticatedSocket,
    payload: { conversationId: string },
  ): Promise<void> {
    const { conversationId } = payload;
    if (!conversationId) return;
    await client.leave(`conversation:${conversationId}`);
    this.logger.debug(
      `userId=${client.data.user.sub} left conversation:${conversationId}`,
    );
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    client: AuthenticatedSocket,
    payload: {
      conversationId: string;
      content?: string;
      messageType?: string;
      mediaId?: string;
      replyToId?: string;
    },
  ): Promise<void> {
    const userId = client.data.user.sub;
    const { conversationId } = payload;

    if (!conversationId) {
      throw new WsException('conversationId is required');
    }

    const messageType = (payload.messageType as MessageType) ?? MessageType.text;

    let message;
    try {
      message = await this.messagesService.sendMessage(conversationId, userId, {
        content: payload.content,
        messageType,
        mediaId: payload.mediaId,
        replyToId: payload.replyToId,
      });
    } catch (err: any) {
      throw new WsException(err.message ?? 'Failed to send message');
    }

    // Broadcast the new message to everyone in the conversation room
    this.server
      .to(`conversation:${conversationId}`)
      .emit('message:new', { message });

    // Ack to sender
    client.emit('message:status', {
      messageId: message.id,
      status: 'sent',
    });

    // Determine conversation participants to check delivery
    try {
      const conversation = await this.conversationsService.getConversationById(
        conversationId,
        userId,
      );

      const otherUserId = conversation.otherParticipant.userId;
      if (otherUserId) {
        const isOnline = await this.presenceService.isOnline(otherUserId);
        if (isOnline) {
          // Emit delivered status to the conversation room so the sender sees it
          this.server
            .to(`conversation:${conversationId}`)
            .emit('message:status', {
              messageId: message.id,
              status: 'delivered',
              conversationId,
            });
        }
      }
    } catch {
      // Non-fatal: status update is best-effort
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    client: AuthenticatedSocket,
    payload: { conversationId: string },
  ): Promise<void> {
    const userId = client.data.user.sub;
    const { conversationId } = payload;
    if (!conversationId) return;

    await this.typingService.startTyping(conversationId, userId);

    client
      .to(`conversation:${conversationId}`)
      .emit('typing:start', { conversationId, userId });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    client: AuthenticatedSocket,
    payload: { conversationId: string },
  ): Promise<void> {
    const userId = client.data.user.sub;
    const { conversationId } = payload;
    if (!conversationId) return;

    await this.typingService.stopTyping(conversationId, userId);

    client
      .to(`conversation:${conversationId}`)
      .emit('typing:stop', { conversationId, userId });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    client: AuthenticatedSocket,
    payload: { conversationId: string; messageId?: string },
  ): Promise<void> {
    const userId = client.data.user.sub;
    const { conversationId } = payload;
    if (!conversationId) return;

    const readCount = await this.messagesService.markConversationRead(
      conversationId,
      userId,
    );

    // Broadcast read receipts to conversation room
    this.server
      .to(`conversation:${conversationId}`)
      .emit('message:status', {
        conversationId,
        status: 'read',
        readBy: userId,
        readCount,
      });
  }

  @SubscribeMessage('presence:heartbeat')
  async handleHeartbeat(client: AuthenticatedSocket): Promise<void> {
    const userId = client.data.user.sub;
    await this.presenceService.refreshPresence(userId);
  }

  // ---------------------------------------------------------------------------
  // Public API (called from other services e.g. MatchingService)
  // ---------------------------------------------------------------------------

  emitMatchNotification(userIds: string[], matchData: object): void {
    for (const userId of userIds) {
      this.server.to(`user:${userId}`).emit('match:new', matchData);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake?.auth?.token as string | undefined;
    if (authToken?.trim()) return authToken.trim();

    const authHeader = client.handshake?.headers?.authorization as
      | string
      | undefined;
    if (authHeader) {
      const parts = authHeader.trim().split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
      }
    }

    return null;
  }
}
