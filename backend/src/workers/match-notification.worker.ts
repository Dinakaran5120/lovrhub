import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { NotificationType } from '@prisma/client';

export const MATCH_NOTIFICATION_QUEUE = 'match-notifications';

export interface SendMatchNotificationJob {
  matchId: string;
  userAId: string;
  userBId: string;
  userADisplayName: string;
  userBDisplayName: string;
}

export interface SendMessageNotificationJob {
  senderId: string;
  recipientId: string;
  senderDisplayName: string;
  messagePreview: string;
  conversationId: string;
}

export interface SendLikeNotificationJob {
  likerUserId: string;
  likerDisplayName: string;
  likedUserId: string;
}

export type MatchNotificationJobData =
  | ({ type: 'send-match-notification' } & SendMatchNotificationJob)
  | ({ type: 'send-message-notification' } & SendMessageNotificationJob)
  | ({ type: 'send-like-notification' } & SendLikeNotificationJob);

export function addMatchNotificationJob(
  queue: Queue,
  data: MatchNotificationJobData,
): Promise<Job> {
  return queue.add(data.type, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  });
}

@Injectable()
export class MatchNotificationWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MatchNotificationWorker.name);
  private worker: Worker | null = null;
  private queue: Queue | null = null;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const redisHost = this.config.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.config.get<number>('REDIS_PORT', 6379);
    const redisPassword = this.config.get<string>('REDIS_PASSWORD');

    const connection = {
      host: redisHost,
      port: redisPort,
      ...(redisPassword ? { password: redisPassword } : {}),
    };

    this.queue = new Queue(MATCH_NOTIFICATION_QUEUE, { connection });

    this.worker = new Worker(
      MATCH_NOTIFICATION_QUEUE,
      async (job: Job<MatchNotificationJobData>) => {
        this.logger.debug(
          `Processing job ${job.id} of type ${job.data.type}`,
        );
        await this.processJob(job);
      },
      {
        connection,
        concurrency: 10,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.debug(
        `Job ${job.id} (${job.data.type}) completed successfully`,
      );
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Job ${job?.id} (${job?.data?.type}) failed: ${err.message}`,
        err.stack,
      );
    });

    this.logger.log('MatchNotificationWorker started');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('MatchNotificationWorker closed');
    }

    if (this.queue) {
      await this.queue.close();
    }
  }

  getQueue(): Queue | null {
    return this.queue;
  }

  private async processJob(job: Job<MatchNotificationJobData>): Promise<void> {
    const { type } = job.data;

    switch (type) {
      case 'send-match-notification':
        await this.handleMatchNotification(job.data as SendMatchNotificationJob);
        break;

      case 'send-message-notification':
        await this.handleMessageNotification(
          job.data as SendMessageNotificationJob,
        );
        break;

      case 'send-like-notification':
        await this.handleLikeNotification(job.data as SendLikeNotificationJob);
        break;

      default:
        this.logger.warn(`Unknown job type: ${type}`);
    }
  }

  private async handleMatchNotification(
    data: SendMatchNotificationJob,
  ): Promise<void> {
    const { matchId, userAId, userBId, userADisplayName, userBDisplayName } =
      data;

    await Promise.allSettled([
      this.notificationsService.createNotification(
        userAId,
        NotificationType.match,
        'New Match! 💘',
        `You matched with ${userBDisplayName}! Say hello.`,
        { matchId, matchedUserId: userBId },
      ),
      this.notificationsService.createNotification(
        userBId,
        NotificationType.match,
        'New Match! 💘',
        `You matched with ${userADisplayName}! Say hello.`,
        { matchId, matchedUserId: userAId },
      ),
    ]);
  }

  private async handleMessageNotification(
    data: SendMessageNotificationJob,
  ): Promise<void> {
    const { recipientId, senderDisplayName, messagePreview, conversationId } =
      data;

    const truncated =
      messagePreview.length > 80
        ? messagePreview.substring(0, 80) + '...'
        : messagePreview;

    await this.notificationsService.createNotification(
      recipientId,
      NotificationType.message,
      `New message from ${senderDisplayName}`,
      truncated,
      { conversationId, senderId: data.senderId },
    );
  }

  private async handleLikeNotification(
    data: SendLikeNotificationJob,
  ): Promise<void> {
    const { likedUserId, likerUserId, likerDisplayName } = data;

    await this.notificationsService.createNotification(
      likedUserId,
      NotificationType.like,
      'Someone liked you! 💖',
      `${likerDisplayName} liked your profile.`,
      { likerUserId },
    );
  }
}
