import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DiscoverService } from './discover.service';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AccountActiveGuard } from '@/common/guards/account-active.guard';
import { SetupCompleteGuard } from '@/common/guards/setup-complete.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { DiscoverQueryDto } from './dto/discover-query.dto';
import { SwipeDto } from './dto/swipe.dto';

@Controller('discover')
@UseGuards(JwtAuthGuard, AccountActiveGuard, SetupCompleteGuard)
export class DiscoverController {
  constructor(
    private readonly discoverService: DiscoverService,
    private readonly matchingService: MatchingService,
  ) {}

  /**
   * GET /discover
   * Returns paginated profiles to swipe on, ordered by relevance + proximity.
   */
  @Get()
  async getDiscoverProfiles(
    @CurrentUser() user: JwtPayload,
    @Query() query: DiscoverQueryDto,
  ) {
    return this.discoverService.getDiscoverProfiles(user.sub, query);
  }

  /**
   * GET /discover/explore
   * Returns profiles filtered by mood for mood-based exploration.
   * `mood` query param is required.
   */
  @Get('explore')
  async exploreByMood(
    @CurrentUser() user: JwtPayload,
    @Query() query: DiscoverQueryDto,
  ) {
    return this.discoverService.exploreByMood(user.sub, query);
  }

  /**
   * GET /discover/matches
   * Returns the current user's active matches with online presence info.
   */
  @Get('matches')
  async getMatches(
    @CurrentUser() user: JwtPayload,
    @Query('online') online?: string,
  ) {
    const onlineOnly = online === 'true' || online === '1';
    return this.matchingService.getMatches(user.sub, onlineOnly);
  }

  /**
   * GET /discover/profiles/:id
   * Returns a detailed profile view for a specific user.
   */
  @Get('profiles/:id')
  async getProfileDetail(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) profileId: string,
  ) {
    return this.discoverService.getProfileDetail(user.sub, profileId);
  }

  /**
   * POST /discover/swipe
   * Records a swipe action and checks for a mutual match.
   * Rate limited: 30 requests per minute per user.
   */
  @Post('swipe')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async processSwipe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SwipeDto,
  ) {
    return this.matchingService.processSwipe(user.sub, dto.swipedUserId, dto.action);
  }

  /**
   * DELETE /discover/matches/:matchId
   * Unmatches two users (soft delete with status=unmatched).
   */
  @Delete('matches/:matchId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unmatch(
    @CurrentUser() user: JwtPayload,
    @Param('matchId', ParseUUIDPipe) matchId: string,
  ) {
    await this.matchingService.unmatch(user.sub, matchId);
  }
}
