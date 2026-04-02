import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

// Config
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import s3Config from './config/s3.config';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

// Feature Modules — each declared as a stub that will be expanded
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiscoverModule } from './discover/discover.module';
import { ConversationsModule } from './conversations/conversations.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { BlocksModule } from './blocks/blocks.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [
    // ----------------------------------------------------------------
    // Configuration — global, loads all registered configs
    // ----------------------------------------------------------------
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, s3Config],
      cache: true,
      expandVariables: true,
    }),

    // ----------------------------------------------------------------
    // Structured logging with Pino
    // ----------------------------------------------------------------
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('app.nodeEnv', 'development');
        const isProd = nodeEnv === 'production';

        return {
          pinoHttp: {
            level: isProd ? 'info' : 'debug',
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: false,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                },
            serializers: {
              req(req) {
                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                  remoteAddress: req.remoteAddress,
                };
              },
              res(res) {
                return {
                  statusCode: res.statusCode,
                };
              },
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.passwordHash',
              ],
              remove: true,
            },
            autoLogging: {
              ignore: (req) => req.url === '/health' || req.url === '/metrics',
            },
          },
        };
      },
    }),

    // ----------------------------------------------------------------
    // Rate limiting with Redis backing
    // ----------------------------------------------------------------
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: config.get<number>('app.rateLimitWindowMs', 60000),
            limit: config.get<number>('app.rateLimitMax', 100),
          },
          {
            name: 'strict',
            ttl: 60000,
            limit: 20,
          },
        ],
      }),
    }),

    // ----------------------------------------------------------------
    // Event bus
    // ----------------------------------------------------------------
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // ----------------------------------------------------------------
    // Cron / scheduled jobs
    // ----------------------------------------------------------------
    ScheduleModule.forRoot(),

    // ----------------------------------------------------------------
    // Core infrastructure modules (global)
    // ----------------------------------------------------------------
    PrismaModule,
    RedisModule,

    // ----------------------------------------------------------------
    // Feature modules
    // ----------------------------------------------------------------
    AuthModule,
    UsersModule,
    DiscoverModule,
    ConversationsModule,
    PostsModule,
    MediaModule,
    BlocksModule,
    ReportsModule,
    NotificationsModule,
    SubscriptionsModule,
    AdminModule,
    ChatGatewayModule,
    WorkersModule,
  ],
})
export class AppModule {}
