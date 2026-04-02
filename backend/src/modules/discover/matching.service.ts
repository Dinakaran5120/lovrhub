import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { SwipeAction } from './dto/swipe.dto';
import { MediaPurpose } from '@prisma/client';

const PRESENCE_KEY_PREFIX = 'presence:';

export interface MatchResult {
  isMatch: boolean;
  match?: {
    id: string;
    conversationId: string;
    matchedUser: {
      id: string;
      displayName: string;
      age: number | null;
      avatarUrl: string | null;
    };
  };
}

export interface MatchWithUser {
  id: string;
  conversationId: string;
  createdAt: Date;
  isOnline: boolean;
  otherUser: {
    id: string;
    displayName: string;
    age: number | null;
    avatarUrl: string | null;
    lastActiveAt: Date | null;
  };
}

@Injectable()
export class MatchingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private calculateAge(birthDate: Date | string | null): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
    return age;
  }

  private async isUserOnline(userId: string): Promise<boolean> {
    const key = `${PRESENCE_KEY_PREFIX}${userId}`;
    const result = await this.redis.get(key);
    return result !== null;
  }

  private orderUserIds(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  // ── processSwipe ─────────────────────────────────────────────────────────────

  async processSwipe(
    swiperId: string,
    swipedId: string,
    action: SwipeAction,
  ): Promise<MatchResult> {
    if (swiperId === swipedId) {
      throw new BadRequestException('You cannot swipe on yourself.');
    }

    // Check blocks in both directions
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: swiperId, blockedId: swipedId },
          { blockerId: swipedId, blockedId: swiperId },
        ],
      },
    });

    if (block) {
      throw new NotFoundException('User not found.');
    }

    // Upsert the swipe record
    await this.prisma.swipe.upsert({
      where: {
        swiperId_swipedId: { swiperId, swipedId },
      },
      create: {
        swiperId,
        swipedId,
        action,
      },
      update: {
        action,
        updatedAt: new Date(),
      },
    });

    // Likes increment total likes received counter
    if (action === SwipeAction.LIKE || action === SwipeAction.SUPER_LIKE) {
      await this.prisma.userStat.upsert({
        where: { userId: swipedId },
        create: {
          userId: swipedId,
          totalLikesReceived: 1,
          totalMatches: 0,
          totalChats: 0,
          profileViews: 0,
          activityScore: 0,
        },
        update: {
          totalLikesReceived: { increment: 1 },
        },
      });
    }

    if (action === SwipeAction.PASS) {
      return { isMatch: false };
    }

    // Check for reverse swipe (mutual like)
    const reverseSwipe = await this.prisma.swipe.findFirst({
      where: {
        swiperId: swipedId,
        swipedId: swiperId,
        action: { in: [SwipeAction.LIKE as any, SwipeAction.SUPER_LIKE as any] },
      },
    });

    if (!reverseSwipe) {
      return { isMatch: false };
    }

    // Check if a match already exists
    const [userAId, userBId] = this.orderUserIds(swiperId, swipedId);
    const existingMatch = await this.prisma.match.findFirst({
      where: { userAId, userBId },
    });

    if (existingMatch) {
      // Match already existed (possibly unmatched + re-matched scenario)
      return { isMatch: false };
    }

    // Create match, conversation, messages, notifications atomically
    const matchedUserProfile = await this.prisma.user.findUnique({
      where: { id: swipedId },
      include: {
        profile: { select: { avatarMediaId: true } },
        media: {
          where: { processingDone: true, purpose: MediaPurpose.profile_photo, isPrimary: true },
          take: 1,
        },
      },
    });

    if (!matchedUserProfile) {
      throw new NotFoundException('Matched user not found.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Create match
      const match = await tx.match.create({
        data: {
          userAId,
          userBId,
          status: 'active',
          initiatedBy: swiperId,
        },
      });

      // Create conversation
      const conversation = await tx.conversation.create({
        data: {
          matchId: match.id,
          participants: {
            create: [{ userId: swiperId }, { userId: swipedId }],
          },
        },
        select: { id: true },
      });

      // Update match with conversationId
      await tx.match.update({
        where: { id: match.id },
        data: { conversationId: conversation.id },
      });

      // System message
      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: swiperId, // system sender; override if you have a system user
          content: "You matched! Say hello 👋",
          type: 'system',
        },
      });

      // Increment totalMatches for both
      for (const uid of [swiperId, swipedId]) {
        await tx.userStat.upsert({
          where: { userId: uid },
          create: {
            userId: uid,
            totalMatches: 1,
            totalLikesReceived: 0,
            totalChats: 0,
            profileViews: 0,
            activityScore: 0,
          },
          update: { totalMatches: { increment: 1 } },
        });
      }

      // Notifications for both users
      const swiperInfo = await tx.user.findUnique({
        where: { id: swiperId },
        select: { displayName: true },
      });

      await tx.notification.createMany({
        data: [
          {
            userId: swipedId,
            type: 'new_match',
            title: "It's a match!",
            body: `You and ${swiperInfo?.displayName ?? 'Someone'} liked each other!`,
            data: JSON.stringify({ matchId: match.id, conversationId: conversation.id }),
          },
          {
            userId: swiperId,
            type: 'new_match',
            title: "It's a match!",
            body: `You and ${matchedUserProfile.displayName} liked each other!`,
            data: JSON.stringify({ matchId: match.id, conversationId: conversation.id }),
          },
        ],
      });

      return { match, conversationId: conversation.id };
    });

    // Emit event outside transaction
    this.eventEmitter.emit('match.created', {
      matchId: result.match.id,
      conversationId: result.conversationId,
      userAId,
      userBId,
    });

    const avatarUrl =
      matchedUserProfile.media[0]?.cdnUrl ?? null;

    return {
      isMatch: true,
      match: {
        id: result.match.id,
        conversationId: result.conversationId,
        matchedUser: {
          id: matchedUserProfile.id,
          displayName: matchedUserProfile.displayName,
          age: this.calculateAge(matchedUserProfile.birthDate),
          avatarUrl,
        },
      },
    };
  }

  // ── unmatch ──────────────────────────────────────────────────────────────────

  async unmatch(userId: string, matchId: string): Promise<void> {
    const match = await this.prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found.');
    }

    if (match.status !== 'active') {
      throw new BadRequestException('This match is no longer active.');
    }

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'unmatched',
        unmatchedAt: new Date(),
        unmatchedById: userId,
      },
    });
  }

  // ── getMatches ───────────────────────────────────────────────────────────────

  async getMatches(userId: string, onlineOnly: boolean): Promise<MatchWithUser[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        status: 'active',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: {
          select: {
            id: true,
            displayName: true,
            birthDate: true,
            lastActiveAt: true,
            media: {
              where: { processingDone: true, purpose: MediaPurpose.profile_photo, isPrimary: true },
              take: 1,
              select: { cdnUrl: true },
            },
          },
        },
        userB: {
          select: {
            id: true,
            displayName: true,
            birthDate: true,
            lastActiveAt: true,
            media: {
              where: { processingDone: true, purpose: MediaPurpose.profile_photo, isPrimary: true },
              take: 1,
              select: { cdnUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const results: MatchWithUser[] = [];

    for (const match of matches) {
      const otherUser = match.userAId === userId ? match.userB : match.userA;
      const isOnline = await this.isUserOnline(otherUser.id);

      if (onlineOnly && !isOnline) continue;

      results.push({
        id: match.id,
        conversationId: match.conversationId!,
        createdAt: match.createdAt,
        isOnline,
        otherUser: {
          id: otherUser.id,
          displayName: otherUser.displayName,
          age: this.calculateAge(otherUser.birthDate),
          avatarUrl: otherUser.media[0]?.cdnUrl ?? null,
          lastActiveAt: otherUser.lastActiveAt,
        },
      });
    }

    return results;
  }
}
