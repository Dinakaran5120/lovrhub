import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { MediaService, GeneratePresignedUrlDto } from './media.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { MediaPurpose } from '@prisma/client';

class GeneratePresignedUrlBody implements GeneratePresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsEnum(MediaPurpose)
  purpose: MediaPurpose;
}

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * POST /media/presigned-url
   * Generate a presigned S3 PUT URL for direct client upload.
   */
  @Post('presigned-url')
  async generatePresignedUrl(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GeneratePresignedUrlBody,
  ) {
    return this.mediaService.generatePresignedUrl(user.sub, dto);
  }

  /**
   * POST /media/:mediaId/confirm
   * Confirm that the client has successfully uploaded to S3.
   */
  @Post(':mediaId/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmUpload(
    @CurrentUser() user: JwtPayload,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    await this.mediaService.confirmUpload(user.sub, mediaId);
  }

  /**
   * DELETE /media/:mediaId
   * Delete a media record and the underlying S3 object.
   */
  @Delete(':mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMedia(
    @CurrentUser() user: JwtPayload,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    await this.mediaService.deleteMedia(user.sub, mediaId);
  }

  /**
   * GET /media?purpose=profile_photo
   * Retrieve the current user's media, optionally filtered by purpose.
   */
  @Get()
  async getUserMedia(
    @CurrentUser() user: JwtPayload,
    @Query('purpose') purpose?: MediaPurpose,
  ) {
    return this.mediaService.getUserMedia(user.sub, purpose);
  }
}
