import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateBioDto } from './dto/update-profile.dto';
import { UpdateVisibilityDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { IsString, IsNotEmpty } from 'class-validator';

class UpdateProfileStepBody {
  @IsString()
  @IsNotEmpty()
  step: string;

  [key: string]: any;
}

class SetAvatarDto {
  @IsString()
  @IsNotEmpty()
  mediaId: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMe(user.sub);
  }

  @Get('me/blocked')
  async getBlockedUsers(@CurrentUser() user: JwtPayload) {
    return this.usersService.getBlockedUsers(user.sub);
  }

  @Get(':id')
  async getProfile(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) targetId: string,
  ) {
    return this.usersService.getProfile(user.sub, targetId);
  }

  @Patch('me/profile/step')
  async updateProfileStep(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateProfileStepBody,
  ) {
    const { step, ...data } = body;
    return this.usersService.updateProfileStep(user.sub, step, data);
  }

  @Patch('me/bio')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBio(@CurrentUser() user: JwtPayload, @Body() dto: UpdateBioDto) {
    await this.usersService.updateBio(user.sub, dto.bio);
  }

  @Patch('me/visibility')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateVisibility(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateVisibilityDto,
  ) {
    await this.usersService.updateVisibility(user.sub, dto.visibility);
  }

  @Patch('me/location')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLocation(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateLocationDto,
  ) {
    await this.usersService.updateLocation(user.sub, dto.lat, dto.lng);
  }

  @Patch('me/mood')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMood(@CurrentUser() user: JwtPayload, @Body() dto: UpdateMoodDto) {
    await this.usersService.updateMood(user.sub, dto.mood ?? null);
  }

  @Patch('me/preferences')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePreferencesDto,
  ) {
    await this.usersService.updatePreferences(user.sub, dto);
  }

  @Patch('me/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setAvatar(@CurrentUser() user: JwtPayload, @Body() dto: SetAvatarDto) {
    await this.usersService.setAvatar(user.sub, dto.mediaId);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@CurrentUser() user: JwtPayload) {
    await this.usersService.deleteAccount(user.sub);
  }
}
