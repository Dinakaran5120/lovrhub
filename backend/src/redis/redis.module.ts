import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const redisUrl = configService.get<string>(
          'redis.url',
          'redis://localhost:6379',
        );
        const keyPrefix = configService.get<string>('redis.keyPrefix', 'lovrhub:');

        const client = new Redis(redisUrl, {
          keyPrefix,
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
          reconnectOnError: (err: Error) => {
            const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
            return targetErrors.some((e) => err.message.includes(e));
          },
          lazyConnect: false,
          connectTimeout: 10000,
          commandTimeout: 5000,
          family: 4, // IPv4
        });

        client.on('connect', () => {
          console.log('[Redis] Connected');
        });

        client.on('ready', () => {
          console.log('[Redis] Ready');
        });

        client.on('error', (err: Error) => {
          console.error('[Redis] Error:', err.message);
        });

        client.on('close', () => {
          console.log('[Redis] Connection closed');
        });

        client.on('reconnecting', () => {
          console.log('[Redis] Reconnecting...');
        });

        return client;
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    const redis = this.moduleRef.get<Redis>(REDIS_CLIENT);
    if (redis && redis.status !== 'end') {
      await redis.quit();
    }
  }
}
