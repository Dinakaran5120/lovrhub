import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/redis/redis.service';
import axios from 'axios';

const EXPO_PUSH_URL = 'https://exp.host/--/push/v2/send';
const PUSH_TOKEN_KEY_PREFIX = 'lovrhub:push_tokens';

export interface PushTokenRecord {
  token: string;
  platform: 'ios' | 'android';
  updatedAt: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  private tokenKey(userId: string): string {
    return `${PUSH_TOKEN_KEY_PREFIX}:${userId}`;
  }

  async storePushToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android',
  ): Promise<void> {
    const record: PushTokenRecord = {
      token,
      platform,
      updatedAt: new Date().toISOString(),
    };

    const client = this.redis.getClient();
    await client.hset(this.tokenKey(userId), {
      token: record.token,
      platform: record.platform,
      updatedAt: record.updatedAt,
    });

    // Expire push tokens after 90 days of inactivity
    await client.expire(this.tokenKey(userId), 60 * 60 * 24 * 90);
  }

  async getPushToken(userId: string): Promise<PushTokenRecord | null> {
    const client = this.redis.getClient();
    const record = await client.hgetall(this.tokenKey(userId));

    if (!record || !record.token) {
      return null;
    }

    return {
      token: record.token,
      platform: record.platform as 'ios' | 'android',
      updatedAt: record.updatedAt,
    };
  }

  async removePushToken(userId: string): Promise<void> {
    const client = this.redis.getClient();
    await client.del(this.tokenKey(userId));
  }

  async sendToUser(
    userId: string,
    notification: PushNotificationPayload,
  ): Promise<void> {
    const tokenRecord = await this.getPushToken(userId);

    if (!tokenRecord) {
      this.logger.debug(`No push token found for user ${userId}`);
      return;
    }

    try {
      await this.sendExpoPushMessages([
        {
          to: tokenRecord.token,
          title: notification.title,
          body: notification.body,
          data: notification.data ?? {},
          sound: 'default',
        },
      ]);
    } catch (error: any) {
      if (this.isInvalidTokenError(error)) {
        this.logger.warn(
          `Invalid push token for user ${userId}, removing from Redis`,
        );
        await this.removePushToken(userId);
      } else {
        this.logger.error(
          `Failed to send push notification to user ${userId}: ${error.message}`,
        );
      }
    }
  }

  async sendToUsers(
    userIds: string[],
    notification: PushNotificationPayload,
  ): Promise<void> {
    if (userIds.length === 0) return;

    // Resolve all tokens
    const tokenPairs = await Promise.all(
      userIds.map(async (uid) => {
        const record = await this.getPushToken(uid);
        return record ? { userId: uid, ...record } : null;
      }),
    );

    const validTokens = tokenPairs.filter(Boolean) as Array<
      PushTokenRecord & { userId: string }
    >;

    if (validTokens.length === 0) return;

    // Expo supports up to 100 messages per request
    const BATCH_SIZE = 100;

    for (let i = 0; i < validTokens.length; i += BATCH_SIZE) {
      const batch = validTokens.slice(i, i + BATCH_SIZE);

      const messages = batch.map((t) => ({
        to: t.token,
        title: notification.title,
        body: notification.body,
        data: notification.data ?? {},
        sound: 'default',
      }));

      try {
        const results = await this.sendExpoPushMessages(messages);

        // Handle ticket-level errors (invalid tokens)
        if (results?.data) {
          for (let j = 0; j < results.data.length; j++) {
            const ticket = results.data[j];
            if (ticket.status === 'error') {
              const details = ticket.details as any;
              if (details?.error === 'DeviceNotRegistered') {
                const user = batch[j];
                this.logger.warn(
                  `Removing invalid push token for user ${user.userId}`,
                );
                await this.removePushToken(user.userId);
              }
            }
          }
        }
      } catch (error: any) {
        this.logger.error(
          `Failed to send batch push notifications: ${error.message}`,
        );
      }
    }
  }

  private async sendExpoPushMessages(messages: object[]): Promise<any> {
    const response = await axios.post(EXPO_PUSH_URL, messages, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return response.data;
  }

  private isInvalidTokenError(error: any): boolean {
    const errorStr = JSON.stringify(error?.response?.data ?? '');
    return (
      errorStr.includes('DeviceNotRegistered') ||
      errorStr.includes('InvalidCredentials') ||
      errorStr.includes('ExponentPushToken')
    );
  }
}
