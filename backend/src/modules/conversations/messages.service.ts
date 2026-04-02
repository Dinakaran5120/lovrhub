import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message, MessageStatus, MessageType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    profile: {
      displayName: string;
      profilePhotoUrl: string | null;
    } | null;
  };
}

export interface GetMessagesResult {
  messages: MessageWithSender[];
  hasMore: boolean;
  oldestCursor: string | null;
}

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(
    conversationId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<MessageWithSender> {
    // Verify sender is a participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: senderId },
        deletedAt: null,
      },
      include: {
        conversation: {
          include: {
            match: true,
          },
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    // Verify match is still active
    const match = participant.conversation.match;
    if (match && match.status !== 'active') {
      throw new ForbiddenException(
        'Cannot send message: the match is no longer active',
      );
    }

    // Validate message content requirements
    const messageType = dto.messageType ?? MessageType.text;
    if (messageType === MessageType.text && !dto.content?.trim()) {
      throw new BadRequestException('Content is required for text messages');
    }
    if (messageType !== MessageType.text && !dto.mediaId) {
      throw new BadRequestException(`mediaId is required for ${messageType} messages`);
    }

    // If replyToId provided, verify it belongs to this conversation
    if (dto.replyToId) {
      const replyMsg = await this.prisma.message.findFirst({
        where: { id: dto.replyToId, conversationId, deletedAt: null },
      });
      if (!replyMsg) {
        throw new NotFoundException('Reply-to message not found in this conversation');
      }
    }

    const now = new Date();

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          type: messageType,
          content: messageType === MessageType.text ? dto.content : null,
          status: MessageStatus.sent,
          replyToId: dto.replyToId ?? null,
        },
        include: {
          sender: {
            select: {
              id: true,
              profile: {
                select: { displayName: true, profilePhotoUrl: true },
              },
            },
          },
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: now },
      }),
      this.prisma.conversationParticipant.update({
        where: {
          conversationId_userId: { conversationId, userId: senderId },
        },
        data: { lastReadAt: now },
      }),
    ]);

    return message as MessageWithSender;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    dto: GetMessagesDto,
  ): Promise<GetMessagesResult> {
    // Verify participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
        deletedAt: null,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const limit = dto.limit ?? 30;
    let cursorCondition: Record<string, any> = {};

    // If cursor provided, resolve the createdAt of that message
    if (dto.before) {
      const cursorMsg = await this.prisma.message.findUnique({
        where: { id: dto.before },
        select: { createdAt: true },
      });
      if (cursorMsg) {
        cursorCondition = { createdAt: { lt: cursorMsg.createdAt } };
      }
    }

    const rawMessages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
        ...cursorCondition,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: { displayName: true, profilePhotoUrl: true },
            },
          },
        },
      },
    });

    const hasMore = rawMessages.length > limit;
    const page = hasMore ? rawMessages.slice(0, limit) : rawMessages;

    // Auto-mark as read (messages not sent by this user, not yet read)
    const unreadIds = page
      .filter((m) => m.senderId !== userId && m.status !== MessageStatus.read)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await this.prisma.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { status: MessageStatus.read, readAt: new Date() },
      });

      // Update participant lastReadAt
      await this.prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { lastReadAt: new Date() },
      });
    }

    // Return in ascending order for display
    const messages = [...page].reverse() as MessageWithSender[];
    const oldestCursor = messages.length > 0 ? messages[0].id : null;

    return { messages, hasMore, oldestCursor };
  }

  async markConversationRead(
    conversationId: string,
    userId: string,
  ): Promise<number> {
    // Verify participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
        deletedAt: null,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const now = new Date();

    const [updateResult] = await this.prisma.$transaction([
      this.prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          status: { not: MessageStatus.read },
          deletedAt: null,
        },
        data: { status: MessageStatus.read, readAt: now },
      }),
      this.prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { lastReadAt: now },
      }),
    ]);

    return updateResult.count;
  }

  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    if (message.deletedAt !== null) {
      throw new BadRequestException('Message has already been deleted');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
        content: null,
      },
    });
  }

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
        deletedAt: null,
      },
    });

    if (!participant) {
      return 0;
    }

    const where: Record<string, any> = {
      conversationId,
      senderId: { not: userId },
      status: { not: MessageStatus.read },
      deletedAt: null,
    };

    if (participant.lastReadAt) {
      where.createdAt = { gt: participant.lastReadAt };
    }

    return this.prisma.message.count({ where });
  }
}
