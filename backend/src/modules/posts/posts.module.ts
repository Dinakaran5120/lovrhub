import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FeedService } from './feed.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService, FeedService],
  exports: [PostsService, FeedService],
})
export class PostsModule {}
