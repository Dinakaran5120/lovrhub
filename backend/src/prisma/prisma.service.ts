import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
    const isDev = nodeEnv === 'development';

    super({
      log: isDev
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'info' },
            { emit: 'event', level: 'warn' },
            { emit: 'event', level: 'error' },
          ]
        : [
            { emit: 'event', level: 'warn' },
            { emit: 'event', level: 'error' },
          ],
      errorFormat: isDev ? 'pretty' : 'minimal',
    });

    if (isDev) {
      // Log queries in development
      (this as unknown as PrismaClient).$on(
        'query' as never,
        (event: Prisma.QueryEvent) => {
          this.logger.debug(
            `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`,
          );
        },
      );
    }

    (this as unknown as PrismaClient).$on(
      'warn' as never,
      (event: Prisma.LogEvent) => {
        this.logger.warn(event.message);
      },
    );

    (this as unknown as PrismaClient).$on(
      'error' as never,
      (event: Prisma.LogEvent) => {
        this.logger.error(event.message);
      },
    );
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  /**
   * Helper: run a callback inside a Prisma transaction.
   */
  async runInTransaction<T>(
    fn: (
      tx: Omit<
        PrismaClient,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >,
    ) => Promise<T>,
    options?: { maxWait?: number; timeout?: number },
  ): Promise<T> {
    return this.$transaction(fn, {
      maxWait: options?.maxWait ?? 5000,
      timeout: options?.timeout ?? 10000,
    });
  }

  /**
   * Helper: soft-delete pattern — sets deletedAt to now.
   */
  async softDelete(
    model: string,
    where: Record<string, unknown>,
  ): Promise<void> {
    // Dynamic call via bracket notation for model access
    const delegate = (this as unknown as Record<string, { updateMany: (args: unknown) => Promise<unknown> }>)[model];
    if (!delegate?.updateMany) {
      throw new Error(`Model "${model}" does not exist or has no updateMany`);
    }
    await delegate.updateMany({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
