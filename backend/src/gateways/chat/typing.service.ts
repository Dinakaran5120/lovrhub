import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class TypingService {
  private readonly logger = new Logger(TypingService.name);
  private readonly PREFIX = 'typing:';
  private readonly TTL_SECONDS = 5;

  constructor(private readonly redis: RedisService) {}

  /**
   * Record that a user started typing in a conversation.
   * Key auto-expires after 5 seconds so stale indicators clean up automatically.
   */
  async startTyping(conversationId: string, userId: string): Promise<void> {
    try {
      await this.redis.setex(
        `${this.PREFIX}${conversationId}:${userId}`,
        this.TTL_SECONDS,
        '1',
      );
    } catch (err) {
      this.logger.error(
        `startTyping(${conversationId}, ${userId}) failed: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Record that a user stopped typing (or sent their message).
   */
  async stopTyping(conversationId: string, userId: string): Promise<void> {
    try {
      await this.redis.del(`${this.PREFIX}${conversationId}:${userId}`);
    } catch (err) {
      this.logger.error(
        `stopTyping(${conversationId}, ${userId}) failed: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Check whether a specific user is currently typing in a conversation.
   */
  async isTyping(conversationId: string, userId: string): Promise<boolean> {
    try {
      const count = await this.redis.exists(
        `${this.PREFIX}${conversationId}:${userId}`,
      );
      return count > 0;
    } catch (err) {
      this.logger.error(
        `isTyping(${conversationId}, ${userId}) failed: ${(err as Error).message}`,
      );
      return false;
    }
  }

  /**
   * Return the subset of participantIds who are currently typing.
   */
  async getTypingUsers(
    conversationId: string,
    participantIds: string[],
  ): Promise<string[]> {
    if (participantIds.length === 0) return [];

    const results = await Promise.allSettled(
      participantIds.map(async (uid) => ({
        uid,
        typing: await this.isTyping(conversationId, uid),
      })),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<{ uid: string; typing: boolean }> =>
          r.status === 'fulfilled' && r.value.typing,
      )
      .map((r) => r.value.uid);
  }
}
