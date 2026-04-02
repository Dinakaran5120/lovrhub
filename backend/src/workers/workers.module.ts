import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MatchNotificationWorker } from './match-notification.worker';
import { MediaProcessingWorker } from './media-processing.worker';
import { PremiumExpiryWorker } from './premium-expiry.worker';
import { AccountPurgeWorker } from './account-purge.worker';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    RedisModule,
    NotificationsModule,
  ],
  providers: [
    MatchNotificationWorker,
    MediaProcessingWorker,
    PremiumExpiryWorker,
    AccountPurgeWorker,
  ],
  exports: [
    MatchNotificationWorker,
    MediaProcessingWorker,
  ],
})
export class WorkersModule {}
