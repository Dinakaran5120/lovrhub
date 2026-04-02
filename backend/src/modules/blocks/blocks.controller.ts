import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  IsOptional,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsUUID, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';
import { BlocksService } from './blocks.service';

class BlockUserDto {
  @IsUUID()
  blockedUserId!: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  reason?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  blockUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: BlockUserDto,
  ) {
    return this.blocksService.blockUser(user.sub, body.blockedUserId, body.reason);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblockUser(
    @CurrentUser() user: JwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.blocksService.unblockUser(user.sub, userId);
  }

  @Get()
  getBlockedUsers(@CurrentUser() user: JwtPayload) {
    return this.blocksService.getBlockedUsers(user.sub);
  }
}
