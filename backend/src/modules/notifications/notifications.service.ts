import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { PushService } from './push.service';
import { NotificationType } from '@prisma/client';

interface PaginatedNotifications {
  notifications: any[];
  nextCursor: string | null;
  hasMore: boolean;
  unreadCount: number;
}

interface MatchCreatedPayload {
  matchId: string;
  userIds: string[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Will be injected by the WebSocket gateway after module init to avoid circular deps
  private socketServer: any = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  setSocketServer(server: any): void {
    this.socketServer = server;
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data ?? {},
        isRead: false,
      },
    });

    // Fire push notification asynchronously - do not await
    this.pushService
      .sendToUser(userId, { title, body, data })
      .catch((err) =>
        this.logger.error(
          `Push notification failed for user ${userId}: ${err.message}`,
        ),
      );

    // Emit via WebSocket if user is online
    if (this.socketServer) {
      this.socketServer
        .to(`user:${userId}`)
        .emit('notification', notification);
    }

    return notification;
  }

  async getNotifications(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedNotifications> {
    let cursorDate: Date | undefined;
    if (cursor) {
      try {
        cursorDate = new Date(Buffer.from(cursor, 'base64').toString('utf8'));
      } catch {
        cursorDate = undefined;
      }
    }

    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: {
          userId,
          ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    const hasMore = notifications.length > limit;
    const items = hasMore ? notifications.slice(0, limit) : notifications;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const last = items[items.length - 1];
      nextCursor = Buffer.from(last.createdAt.toISOString()).toString('base64');
    }

    return {
      notifications: items,
      nextCursor,
      hasMore,
      unreadCount,
    };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this notification',
      );
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updated: result.count };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async storePushToken(
    userId: string,
    token: string,
    platform: string,
  ): Promise<void> {
    await this.pushService.storePushToken(
      userId,
      token,
      platform as 'ios' | 'android',
    );
  }

  @OnEvent('match.created')
  async handleMatchCreated(payload: MatchCreatedPayload): Promise<void> {
    const { userIds } = payload;

    const notificationPromises = userIds.map((uid) =>
      this.createNotification(
        uid,
        NotificationType.match,
        'New Match! 💘',
        'You have a new match! Say hello.',
        { matchId: payload.matchId },
      ).catch((err) =>
        this.logger.error(
          `Failed to create match notification for user ${uid}: ${err.message}`,
        ),
      ),
    );

    await Promise.allSettled(notificationPromises);
  }
}
