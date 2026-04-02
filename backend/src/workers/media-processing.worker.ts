import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import { PrismaService } from '@/prisma/prisma.service';

export const MEDIA_PROCESSING_QUEUE = 'media-processing';

export interface ProcessImageJob {
  type: 'process-image';
  mediaId: string;
  userId: string;
  s3Key: string;
  mimeType: string;
  originalFilename: string;
}

export interface ProcessVideoJob {
  type: 'process-video';
  mediaId: string;
  userId: string;
  s3Key: string;
  mimeType: string;
  originalFilename: string;
}

export interface CleanupUnconfirmedJob {
  type: 'cleanup-unconfirmed';
}

export type MediaProcessingJobData =
  | ProcessImageJob
  | ProcessVideoJob
  | CleanupUnconfirmedJob;

@Injectable()
export class MediaProcessingWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MediaProcessingWorker.name);
  private worker: Worker | null = null;
  private queue: Queue | null = null;

  constructor(
    private readonly prisma: PrismaService,
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

    this.queue = new Queue(MEDIA_PROCESSING_QUEUE, { connection });

    this.worker = new Worker(
      MEDIA_PROCESSING_QUEUE,
      async (job: Job<MediaProcessingJobData>) => {
        this.logger.debug(
          `Processing media job ${job.id} of type ${job.data.type}`,
        );
        await this.processJob(job);
      },
      {
        connection,
        concurrency: 5,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.debug(`Media job ${job.id} (${job.data.type}) completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Media job ${job?.id} (${job?.data?.type}) failed: ${err.message}`,
        err.stack,
      );
    });

    this.logger.log('MediaProcessingWorker started');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('MediaProcessingWorker closed');
    }

    if (this.queue) {
      await this.queue.close();
    }
  }

  getQueue(): Queue | null {
    return this.queue;
  }

  private async processJob(job: Job<MediaProcessingJobData>): Promise<void> {
    const { type } = job.data;

    switch (type) {
      case 'process-image':
        await this.handleProcessImage(job.data as ProcessImageJob);
        break;

      case 'process-video':
        await this.handleProcessVideo(job.data as ProcessVideoJob);
        break;

      case 'cleanup-unconfirmed':
        await this.handleCleanupUnconfirmed();
        break;

      default:
        this.logger.warn(`Unknown media job type: ${(job.data as any).type}`);
    }
  }

  private async handleProcessImage(data: ProcessImageJob): Promise<void> {
    const { mediaId, userId, s3Key, mimeType, originalFilename } = data;

    this.logger.log(
      `Processing image: mediaId=${mediaId}, userId=${userId}, s3Key=${s3Key}, mimeType=${mimeType}, filename=${originalFilename}`,
    );

    // In production: invoke AWS Lambda or Sharp to resize/transcode the image,
    // generate thumbnails, extract metadata, update CDN URLs.
    // For now: mark processing as done.
    await this.prisma.userMedia.update({
      where: { id: mediaId },
      data: {
        processingDone: true,
        processedAt: new Date(),
      },
    });

    this.logger.log(
      `Image processing complete for mediaId=${mediaId}`,
    );
  }

  private async handleProcessVideo(data: ProcessVideoJob): Promise<void> {
    const { mediaId, userId, s3Key, mimeType, originalFilename } = data;

    this.logger.log(
      `Processing video: mediaId=${mediaId}, userId=${userId}, s3Key=${s3Key}, mimeType=${mimeType}, filename=${originalFilename}`,
    );

    // In production: invoke AWS Elemental MediaConvert or FFmpeg Lambda to
    // transcode video to HLS/MP4, generate thumbnail frame, extract duration.
    // For now: mark processing as done.
    await this.prisma.userMedia.update({
      where: { id: mediaId },
      data: {
        processingDone: true,
        processedAt: new Date(),
      },
    });

    this.logger.log(
      `Video processing complete for mediaId=${mediaId}`,
    );
  }

  private async handleCleanupUnconfirmed(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.logger.log(
      `Running cleanup-unconfirmed: removing UserMedia older than 1 hour with processingDone=false`,
    );

    const staleMedia = await this.prisma.userMedia.findMany({
      where: {
        processingDone: false,
        createdAt: { lt: oneHourAgo },
      },
      select: { id: true, s3Key: true, userId: true },
    });

    if (staleMedia.length === 0) {
      this.logger.debug('No stale unconfirmed media found');
      return;
    }

    this.logger.log(
      `Found ${staleMedia.length} stale unconfirmed media records to delete`,
    );

    const ids = staleMedia.map((m) => m.id);

    await this.prisma.userMedia.deleteMany({
      where: { id: { in: ids } },
    });

    this.logger.log(
      `Deleted ${ids.length} stale unconfirmed media records from DB`,
    );
  }
}
