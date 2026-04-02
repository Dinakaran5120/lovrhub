import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisService } from '@/redis/redis.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly PREFIX = 'presence:';
  private readonly TTL_SECONDS = 30;

  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Mark a user as online by setting an expiring Redis key.
   */
  async setOnline(userId: string): Promise<void> {
    try {
      await this.redis.setex(`${this.PREFIX}${userId}`, this.TTL_SECONDS, '1');
    } catch (err) {
      this.logger.error(`setOnline(${userId}) failed: ${(err as Error).message}`);
    }
  }

  /**
   * Mark a user as offline by deleting their presence key.
   */
  async setOffline(userId: string): Promise<void> {
    try {
      await this.redis.del(`${this.PREFIX}${userId}`);
    } catch (err) {
      this.logger.error(`setOffline(${userId}) failed: ${(err as Error).message}`);
    }
  }

  /**
   * Check whether a user is currently online.
   */
  async isOnline(userId: string): Promise<boolean> {
    try {
      const count = await this.redis.exists(`${this.PREFIX}${userId}`);
      return count > 0;
    } catch (err) {
      this.logger.error(`isOnline(${userId}) failed: ${(err as Error).message}`);
      return false;
    }
  }

  /**
   * Filter a list of user IDs down to those currently online.
   */
  async getOnlineUsers(userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];

    const results = await Promise.allSettled(
      userIds.map(async (uid) => ({ uid, online: await this.isOnline(uid) })),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<{ uid: string; online: boolean }> =>
          r.status === 'fulfilled' && r.value.online,
      )
      .map((r) => r.value.uid);
  }

  /**
   * Refresh the presence TTL (called on heartbeat).
   */
  async refreshPresence(userId: string): Promise<void> {
    try {
      await this.redis.expire(`${this.PREFIX}${userId}`, this.TTL_SECONDS);
    } catch (err) {
      this.logger.error(`refreshPresence(${userId}) failed: ${(err as Error).message}`);
    }
  }

  /**
   * Emit a presence update to all users who have an active match with the
   * given user, so their clients can update the online indicator.
   */
  async broadcastPresence(
    server: Server,
    userId: string,
    isOnline: boolean,
  ): Promise<void> {
    try {
      // Find all active matches for this user
      const matches = await this.prisma.match.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
          status: 'active',
          deletedAt: null,
        },
        select: { userAId: true, userBId: true },
      });

      for (const match of matches) {
        const partnerId = match.userAId === userId ? match.userBId : match.userAId;
        server
          .to(`user:${partnerId}`)
          .emit('presence:update', { userId, isOnline });
      }
    } catch (err) {
      this.logger.error(
        `broadcastPresence(${userId}) failed: ${(err as Error).message}`,
      );
    }
  }
}
