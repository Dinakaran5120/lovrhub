import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { ConversationsModule } from '@/modules/conversations/conversations.module';
import { ChatGateway } from './chat.gateway';
import { PresenceService } from './presence.service';
import { TypingService } from './typing.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
      }),
    }),
    PrismaModule,
    RedisModule,
    ConversationsModule,
  ],
  providers: [ChatGateway, PresenceService, TypingService],
  exports: [ChatGateway, PresenceService, TypingService],
})
export class ChatModule {}
