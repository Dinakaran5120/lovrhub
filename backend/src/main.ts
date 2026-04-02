import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const port = configService.get<number>('app.port', 3000);
  const apiVersion = configService.get<string>('app.apiVersion', 'v1');
  const allowedOriginsRaw = configService.get<string>('app.allowedOrigins', '');

  const allowedOrigins = allowedOriginsRaw
    ? allowedOriginsRaw.split(',').map((o) => o.trim())
    : [];

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: nodeEnv === 'production',
    }),
  );

  // Gzip compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Device-ID'],
    credentials: true,
    maxAge: 86400,
  });

  // URI versioning (/v1/users, /v2/users)
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: '',
    defaultVersion: apiVersion,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger documentation (disabled in production)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('LovrHub API')
      .setDescription(
        'LovrHub Dating App REST API - Complete documentation for all endpoints',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'access-token',
      )
      .addTag('auth', 'Authentication & authorization endpoints')
      .addTag('users', 'User profile management')
      .addTag('discover', 'Discovery & swiping')
      .addTag('matches', 'Match management')
      .addTag('conversations', 'Messaging & conversations')
      .addTag('posts', 'Posts & stories')
      .addTag('media', 'Media upload & management')
      .addTag('blocks', 'User blocking')
      .addTag('reports', 'Content reporting')
      .addTag('notifications', 'Push & in-app notifications')
      .addTag('subscriptions', 'Subscription & billing')
      .addTag('admin', 'Admin panel endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');

  const appLogger = app.get(Logger);
  appLogger.log(
    `LovrHub API running on http://0.0.0.0:${port} [${nodeEnv}]`,
    'Bootstrap',
  );
  if (nodeEnv !== 'production') {
    appLogger.log(
      `Swagger docs available at http://0.0.0.0:${port}/docs`,
      'Bootstrap',
    );
  }
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
