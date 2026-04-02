import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostVisibility } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const { mediaIds, caption, mood, visibility } = dto;

    // Verify all mediaIds belong to this user and processing is done
    const mediaRecords = await this.prisma.userMedia.findMany({
      where: {
        id: { in: mediaIds },
        userId,
        processingDone: true,
      },
    });

    if (mediaRecords.length !== mediaIds.length) {
      throw new BadRequestException(
        'One or more media items are invalid, not owned by you, or still processing.',
      );
    }

    // Ensure ordering matches the requested array
    const mediaIdIndexMap = new Map(mediaIds.map((id, idx) => [id, idx]));

    const post = await this.prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          userId,
          caption: caption ?? null,
          mood: mood ?? null,
          visibility: visibility ?? PostVisibility.public,
          isDeleted: false,
        },
      });

      await tx.postMedia.createMany({
        data: mediaIds.map((mediaId) => ({
          postId: newPost.id,
          mediaId,
          displayOrder: mediaIdIndexMap.get(mediaId) ?? 0,
        })),
      });

      return tx.post.findUnique({
        where: { id: newPost.id },
        include: {
          media: {
            orderBy: { displayOrder: 'asc' },
            include: {
              media: {
                select: { id: true, cdnUrl: true, thumbnailUrl: true, mimeType: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              displayName: true,
              isVerified: true,
              subscriptionTier: true,
              profile: {
                select: {
                  avatarMedia: { select: { cdnUrl: true, thumbnailUrl: true } },
                },
              },
            },
          },
        },
      });
    });

    return this.formatPost(post);
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    if (post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(dto.caption !== undefined ? { caption: dto.caption } : {}),
        ...(dto.mood !== undefined ? { mood: dto.mood } : {}),
        ...(dto.visibility !== undefined ? { visibility: dto.visibility } : {}),
      },
      include: {
        media: {
          orderBy: { displayOrder: 'asc' },
          include: {
            media: {
              select: { id: true, cdnUrl: true, thumbnailUrl: true, mimeType: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            isVerified: true,
            subscriptionTier: true,
            profile: {
              select: {
                avatarMedia: { select: { cdnUrl: true, thumbnailUrl: true } },
              },
            },
          },
        },
      },
    });

    return this.formatPost(updated);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async getPost(viewerId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        media: {
          orderBy: { displayOrder: 'asc' },
          include: {
            media: {
              select: { id: true, cdnUrl: true, thumbnailUrl: true, mimeType: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            isVerified: true,
            subscriptionTier: true,
            deletedAt: true,
            accountStatus: true,
            profile: {
              select: {
                avatarMedia: { select: { cdnUrl: true, thumbnailUrl: true } },
              },
            },
          },
        },
      },
    });

    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.deletedAt !== null) {
      throw new NotFoundException('Post not found');
    }

    const postOwnerId = post.userId;

    // Owner can always see their own posts
    if (viewerId === postOwnerId) {
      return this.formatPost(post);
    }

    // Check if viewer is blocked by or has blocked the post owner
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: viewerId, blockedId: postOwnerId },
          { blockerId: postOwnerId, blockedId: viewerId },
        ],
      },
    });

    if (block) {
      throw new NotFoundException('Post not found');
    }

    // Check visibility rules
    if (post.visibility === PostVisibility.public) {
      return this.formatPost(post);
    }

    // For private or matches_only, must be matched
    if (
      post.visibility === PostVisibility.private ||
      post.visibility === PostVisibility.matches_only
    ) {
      const match = await this.prisma.match.findFirst({
        where: {
          OR: [
            { userAId: viewerId, userBId: postOwnerId },
            { userAId: postOwnerId, userBId: viewerId },
          ],
          status: 'active',
        },
      });

      if (!match) {
        throw new ForbiddenException('You do not have permission to view this post');
      }

      return this.formatPost(post);
    }

    throw new ForbiddenException('You do not have permission to view this post');
  }

  private formatPost(post: any) {
    if (!post) return null;

    const avatarUrl = post.user?.profile?.avatarMedia?.cdnUrl ?? null;

    return {
      id: post.id,
      caption: post.caption,
      mood: post.mood,
      visibility: post.visibility,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.user.id,
        displayName: post.user.displayName,
        isVerified: post.user.isVerified,
        subscriptionTier: post.user.subscriptionTier,
        avatarUrl,
      },
      media: post.media.map((pm: any) => ({
        displayOrder: pm.displayOrder,
        id: pm.media.id,
        cdnUrl: pm.media.cdnUrl,
        thumbnailUrl: pm.media.thumbnailUrl,
        mimeType: pm.media.mimeType,
      })),
    };
  }
}
