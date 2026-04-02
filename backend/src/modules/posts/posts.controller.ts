import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AccountActiveGuard } from '@/common/guards/account-active.guard';
import { SetupCompleteGuard } from '@/common/guards/setup-complete.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetFeedDto } from './dto/get-feed.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard, AccountActiveGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly feedService: FeedService,
  ) {}

  @Post()
  @UseGuards(SetupCompleteGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.createPost(userId, dto);
  }

  @Get('feed')
  async getFeed(
    @CurrentUser('id') userId: string,
    @Query() dto: GetFeedDto,
  ) {
    return this.feedService.getFeed(userId, dto);
  }

  @Get(':id')
  async getPost(
    @CurrentUser('id') viewerId: string,
    @Param('id', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.getPost(viewerId, postId);
  }

  @Patch(':id')
  async updatePost(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(userId, postId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) postId: string,
  ) {
    await this.postsService.deletePost(userId, postId);
  }

  @Get('users/:userId/posts')
  async getUserPosts(
    @CurrentUser('id') viewerId: string,
    @Param('userId', ParseUUIDPipe) targetUserId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.feedService.getUserPosts(
      viewerId,
      targetUserId,
      Math.min(limit, 50),
      cursor,
    );
  }
}
