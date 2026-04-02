import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { S3Service } from './s3.service';
import { MediaPurpose } from '@prisma/client';

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
]);

const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime', // .mov
]);

// Max file sizes
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

// Purposes that accept only images
const IMAGE_ONLY_PURPOSES = new Set<MediaPurpose>([
  MediaPurpose.profile_photo,
  MediaPurpose.gallery,
]);

// Purposes that accept only videos
const VIDEO_ONLY_PURPOSES = new Set<MediaPurpose>([MediaPurpose.video]);

export interface GeneratePresignedUrlDto {
  fileName: string;
  mimeType: string;
  purpose: MediaPurpose;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  mediaId: string;
  s3Key: string;
  expiresAt: Date;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // ── Private helpers ─────────────────────────────────────────────────────────

  private validateMimeAndPurpose(
    mimeType: string,
    purpose: MediaPurpose,
  ): { isImage: boolean; maxBytes: number } {
    const isImage = ALLOWED_IMAGE_MIME_TYPES.has(mimeType);
    const isVideo = ALLOWED_VIDEO_MIME_TYPES.has(mimeType);

    if (!isImage && !isVideo) {
      throw new BadRequestException(
        `Unsupported MIME type "${mimeType}". Allowed: jpeg, png, webp, heic, mp4, mov.`,
      );
    }

    if (IMAGE_ONLY_PURPOSES.has(purpose) && !isImage) {
      throw new BadRequestException(
        `Purpose "${purpose}" only accepts image files.`,
      );
    }

    if (VIDEO_ONLY_PURPOSES.has(purpose) && !isVideo) {
      throw new BadRequestException(
        `Purpose "${purpose}" only accepts video files.`,
      );
    }

    return {
      isImage,
      maxBytes: isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES,
    };
  }

  // ── Public methods ───────────────────────────────────────────────────────────

  async generatePresignedUrl(
    userId: string,
    dto: GeneratePresignedUrlDto,
  ): Promise<PresignedUrlResponse> {
    const { isImage, maxBytes } = this.validateMimeAndPurpose(dto.mimeType, dto.purpose);

    // Count existing media for purpose-specific limits
    if (dto.purpose === MediaPurpose.profile_photo || dto.purpose === MediaPurpose.gallery) {
      const count = await this.prisma.userMedia.count({
        where: { userId, purpose: dto.purpose, processingDone: true },
      });
      const max = dto.purpose === MediaPurpose.profile_photo ? 6 : 20;
      if (count >= max) {
        throw new BadRequestException(
          `You have reached the maximum number of ${dto.purpose} uploads (${max}).`,
        );
      }
    }

    const s3Key = this.s3Service.generateS3Key(userId, dto.purpose, dto.fileName);
    const cdnUrl = this.s3Service.getCdnUrl(s3Key);
    const thumbnailUrl = isImage ? this.s3Service.getThumbnailUrl(s3Key) : null;

    const [media, uploadUrl] = await Promise.all([
      this.prisma.userMedia.create({
        data: {
          userId,
          purpose: dto.purpose,
          s3Key,
          cdnUrl,
          thumbnailUrl,
          mimeType: dto.mimeType,
          fileSizeBytes: 0, // Updated by Lambda after upload
          displayOrder: 0,
          isPrimary: false,
          processingDone: false,
        },
      }),
      this.s3Service.generatePresignedUploadUrl(s3Key, dto.mimeType, maxBytes),
    ]);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    return {
      uploadUrl,
      mediaId: media.id,
      s3Key,
      expiresAt,
    };
  }

  async confirmUpload(userId: string, mediaId: string): Promise<void> {
    const media = await this.prisma.userMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media record not found.');
    }

    if (media.userId !== userId) {
      throw new ForbiddenException('This media does not belong to you.');
    }

    if (media.processingDone) {
      // Already confirmed — idempotent
      return;
    }

    // Verify the object actually landed in S3
    const exists = await this.s3Service.objectExists(media.s3Key);
    if (!exists) {
      throw new BadRequestException(
        'Object not found in storage. Please upload the file before confirming.',
      );
    }

    await this.prisma.userMedia.update({
      where: { id: mediaId },
      data: { processingDone: true },
    });

    // Auto-set avatar if this is the first confirmed profile_photo
    if (media.purpose === MediaPurpose.profile_photo) {
      const existingAvatar = await this.prisma.userProfile.findUnique({
        where: { userId },
        select: { avatarMediaId: true },
      });

      if (!existingAvatar?.avatarMediaId) {
        await this.prisma.userProfile.upsert({
          where: { userId },
          create: { userId, avatarMediaId: mediaId },
          update: { avatarMediaId: mediaId },
        });

        // Mark as primary if none exists
        const hasPrimary = await this.prisma.userMedia.count({
          where: {
            userId,
            purpose: MediaPurpose.profile_photo,
            isPrimary: true,
          },
        });

        if (!hasPrimary) {
          await this.prisma.userMedia.update({
            where: { id: mediaId },
            data: { isPrimary: true, displayOrder: 0 },
          });
        }
      }
    }
  }

  async deleteMedia(userId: string, mediaId: string): Promise<void> {
    const media = await this.prisma.userMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media not found.');
    }

    if (media.userId !== userId) {
      throw new ForbiddenException('This media does not belong to you.');
    }

    // If this is the current avatar, clear it
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      select: { avatarMediaId: true },
    });

    const ops: Promise<any>[] = [
      this.s3Service.deleteObject(media.s3Key),
      this.prisma.userMedia.delete({ where: { id: mediaId } }),
    ];

    if (profile?.avatarMediaId === mediaId) {
      // Assign the next available profile photo as avatar
      const nextAvatar = await this.prisma.userMedia.findFirst({
        where: {
          userId,
          purpose: MediaPurpose.profile_photo,
          processingDone: true,
          id: { not: mediaId },
        },
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
      });

      ops.push(
        this.prisma.userProfile.update({
          where: { userId },
          data: { avatarMediaId: nextAvatar?.id ?? null },
        }),
      );
    }

    await Promise.all(ops);
  }

  async getUserMedia(
    userId: string,
    purpose?: MediaPurpose,
  ): Promise<
    Array<{
      id: string;
      purpose: string;
      cdnUrl: string;
      thumbnailUrl: string | null;
      mimeType: string;
      fileSizeBytes: number;
      widthPx: number | null;
      heightPx: number | null;
      durationSecs: number | null;
      displayOrder: number;
      isPrimary: boolean;
      processingDone: boolean;
    }>
  > {
    const media = await this.prisma.userMedia.findMany({
      where: {
        userId,
        ...(purpose ? { purpose } : {}),
      },
      orderBy: [{ purpose: 'asc' }, { isPrimary: 'desc' }, { displayOrder: 'asc' }],
    });

    return media.map((m) => ({
      id: m.id,
      purpose: m.purpose,
      cdnUrl: m.cdnUrl,
      thumbnailUrl: m.thumbnailUrl,
      mimeType: m.mimeType,
      fileSizeBytes: m.fileSizeBytes,
      widthPx: m.widthPx,
      heightPx: m.heightPx,
      durationSecs: m.durationSecs,
      displayOrder: m.displayOrder,
      isPrimary: m.isPrimary,
      processingDone: m.processingDone,
    }));
  }
}
