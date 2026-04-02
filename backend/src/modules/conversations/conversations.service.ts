import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import {
  decodeCursor,
  encodeCursor,
  PaginatedResponse,
} from '@/common/utils/cursor-pagination.util';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { MessagesService } from './messages.service';

export interface ConversationListItem {
  id: string;
  createdAt: Date;
  lastMessageAt: Date | null;
  otherParticipant: {
    userId: string;
    displayName: string;
    profilePhotoUrl: string | null;
    locationCity: string | null;
    isVerified: boolean;
    subscriptionTier: string;
    isOnline: boolean;
  };
  lastMessage: {
    id: string;
    content: string | null;
    type: string;
    senderId: string;
    createdAt: Date;
  } | null;
  unreadCount: number;
  isArchived: boolean;
}

export interface ConversationDetail {
  id: string;
  matchId: string | null;
  createdAt: Date;
  lastMessageAt: Date | null;
  match: {
    id: string;
    status: string;
    createdAt: Date;
  } | null;
  otherParticipant: {
    userId: string;
    displayName: string;
    profilePhotoUrl: string | null;
    bio: string | null;
    locationCity: string | null;
    isVerified: boolean;
    subscriptionTier: string;
    isOnline: boolean;
  };
  myParticipant: {
    lastReadAt: Date | null;
    isArchived: boolean;
    isMuted: boolean;
  };
}

@Injectable()
export class ConversationsService {
  private readonly PRESENCE_PREFIX = 'presence:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly messagesService: MessagesService,
  ) {}

  async getConversations(
    userId: string,
    dto: GetConversationsDto,
  ): Promise<PaginatedResponse<ConversationListItem>> {
    const limit = dto.limit ?? 20;
    const offset = decodeCursor(dto.cursor ?? '');

    // Get total count first
    const countWhere = this.buildConversationWhere(userId, dto);
    const total = await this.prisma.conversation.count({ where: countWhere });

    const conversations = await this.prisma.conversation.findMany({
      where: countWhere,
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit + 1,
      include: {
        participants: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                subscriptionTier: true,
                profile: {
                  select: {
                    displayName: true,
                    profilePhotoUrl: true,
                    currentCity: true,
                    isVerified: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            type: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
    });

    const hasMore = conversations.length > limit;
    const page = hasMore ? conversations.slice(0, limit) : conversations;

    // Collect all other-participant userIds for online check
    const otherUserIds = page
      .map((c) => {
        const other = c.participants.find((p) => p.userId !== userId);
        return other?.userId;
      })
      .filter(Boolean) as string[];

    const onlineSet = await this.getOnlineUserSet(otherUserIds);

    // Build unread counts
    const unreadCountMap = await this.buildUnreadCountMap(
      page.map((c) => c.id),
      userId,
    );

    const items: ConversationListItem[] = page.map((conv) => {
      const myParticipant = conv.participants.find((p) => p.userId === userId);
      const otherParticipant = conv.participants.find((p) => p.userId !== userId);
      const lastMsg = conv.messages[0] ?? null;
      const unreadCount = unreadCountMap.get(conv.id) ?? 0;

      return {
        id: conv.id,
        createdAt: conv.createdAt,
        lastMessageAt: conv.lastMessageAt,
        otherParticipant: {
          userId: otherParticipant?.userId ?? '',
          displayName: otherParticipant?.user?.profile?.displayName ?? 'Unknown',
          profilePhotoUrl: otherParticipant?.user?.profile?.profilePhotoUrl ?? null,
          locationCity: otherParticipant?.user?.profile?.currentCity ?? null,
          isVerified: otherParticipant?.user?.profile?.isVerified ?? false,
          subscriptionTier: otherParticipant?.user?.subscriptionTier ?? 'free',
          isOnline: otherParticipant ? onlineSet.has(otherParticipant.userId) : false,
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              type: lastMsg.type,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt,
            }
          : null,
        unreadCount,
        isArchived: myParticipant?.isArchived ?? false,
      };
    });

    // Apply unread filter after fetch (since counts are computed above)
    const filtered =
      dto.filter === 'unread' ? items.filter((i) => i.unreadCount > 0) : items;

    const nextOffset = offset + page.length;
    const actualHasMore = hasMore || (dto.filter === 'unread' && filtered.length < page.length);

    return {
      data: filtered,
      nextCursor: hasMore ? encodeCursor(nextOffset) : null,
      hasMore: actualHasMore,
      total,
    };
  }

  async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<ConversationDetail> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId, deletedAt: null },
      include: {
        match: {
          select: { id: true, status: true, createdAt: true },
        },
        participants: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                subscriptionTier: true,
                profile: {
                  select: {
                    displayName: true,
                    profilePhotoUrl: true,
                    bio: true,
                    currentCity: true,
                    isVerified: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const myParticipant = conversation.participants.find((p) => p.userId === userId);
    if (!myParticipant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const otherParticipant = conversation.participants.find((p) => p.userId !== userId);

    const isOnline = otherParticipant
      ? (await this.redis.exists(`${this.PRESENCE_PREFIX}${otherParticipant.userId}`)) > 0
      : false;

    return {
      id: conversation.id,
      matchId: conversation.matchId,
      createdAt: conversation.createdAt,
      lastMessageAt: conversation.lastMessageAt,
      match: conversation.match
        ? {
            id: conversation.match.id,
            status: conversation.match.status,
            createdAt: conversation.match.createdAt,
          }
        : null,
      otherParticipant: {
        userId: otherParticipant?.userId ?? '',
        displayName: otherParticipant?.user?.profile?.displayName ?? 'Unknown',
        profilePhotoUrl: otherParticipant?.user?.profile?.profilePhotoUrl ?? null,
        bio: otherParticipant?.user?.profile?.bio ?? null,
        locationCity: otherParticipant?.user?.profile?.currentCity ?? null,
        isVerified: otherParticipant?.user?.profile?.isVerified ?? false,
        subscriptionTier: otherParticipant?.user?.subscriptionTier ?? 'free',
        isOnline,
      },
      myParticipant: {
        lastReadAt: myParticipant.lastReadAt,
        isArchived: myParticipant.isArchived,
        isMuted: myParticipant.isMuted,
      },
    };
  }

  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    await this.assertParticipant(conversationId, userId);
    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { isArchived: true },
    });
  }

  async unarchiveConversation(conversationId: string, userId: string): Promise<void> {
    await this.assertParticipant(conversationId, userId);
    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { isArchived: false },
    });
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private buildConversationWhere(
    userId: string,
    dto: GetConversationsDto,
  ): Record<string, any> {
    const where: Record<string, any> = {
      deletedAt: null,
      participants: {
        some: {
          userId,
          isArchived: false,
          deletedAt: null,
        },
      },
    };

    if (dto.search) {
      where.participants = {
        some: {
          userId: { not: userId },
          deletedAt: null,
          user: {
            profile: {
              displayName: {
                contains: dto.search,
                mode: 'insensitive',
              },
            },
          },
        },
      };
    }

    return where;
  }

  private async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
        deletedAt: null,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }
  }

  private async getOnlineUserSet(userIds: string[]): Promise<Set<string>> {
    if (userIds.length === 0) return new Set();

    const results = await Promise.allSettled(
      userIds.map(async (uid) => {
        const exists = await this.redis.exists(`${this.PRESENCE_PREFIX}${uid}`);
        return { uid, online: exists > 0 };
      }),
    );

    const onlineSet = new Set<string>();
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.online) {
        onlineSet.add(r.value.uid);
      }
    }
    return onlineSet;
  }

  private async buildUnreadCountMap(
    conversationIds: string[],
    userId: string,
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (conversationIds.length === 0) return map;

    await Promise.all(
      conversationIds.map(async (cid) => {
        const count = await this.messagesService.getUnreadCount(cid, userId);
        map.set(cid, count);
      }),
    );

    return map;
  }
}
