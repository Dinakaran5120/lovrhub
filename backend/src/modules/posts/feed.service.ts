import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { GetFeedDto } from './dto/get-feed.dto';
import { PostVisibility } from '@prisma/client';

interface PaginatedPosts {
  posts: any[];
  nextCursor: string | null;
  hasMore: boolean;
}

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(userId: string, dto: GetFeedDto): Promise<PaginatedPosts> {
    const { limit, cursor, mood } = dto;

    // Get user's active match list
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
        status: 'active',
      },
      select: { userAId: true, userBId: true },
    });

    const matchedUserIds = matches.map((m) =>
      m.userAId === userId ? m.userBId : m.userAId,
    );

    // Get user's block list (blocked and blocker directions)
    const blocks = await this.prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
      select: { blockerId: true, blockedId: true },
    });

    const blockedUserIds = new Set<string>();
    for (const b of blocks) {
      if (b.blockerId === userId) blockedUserIds.add(b.blockedId);
      else blockedUserIds.add(b.blockerId);
    }

    const blockedArray = Array.from(blockedUserIds);

    // Build cursor condition
    let cursorDate: Date | undefined;
    if (cursor) {
      try {
        cursorDate = new Date(Buffer.from(cursor, 'base64').toString('utf8'));
      } catch {
        cursorDate = undefined;
      }
    }

    // Query posts with visibility rules
    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
        ...(mood ? { mood } : {}),
        user: {
          deletedAt: null,
          accountStatus: { in: ['active', 'inactive'] },
          id: { notIn: blockedArray },
        },
        OR: [
          // Public posts from non-blocked users (excluding the viewer themselves handled by notIn)
          {
            visibility: PostVisibility.public,
            userId: { notIn: blockedArray },
          },
          // matches_only posts from matched users
          {
            visibility: PostVisibility.matches_only,
            userId: { in: matchedUserIds.filter((id) => !blockedUserIds.has(id)) },
          },
          // private posts from matched users
          {
            visibility: PostVisibility.private,
            userId: { in: matchedUserIds.filter((id) => !blockedUserIds.has(id)) },
          },
          // User's own posts
          {
            userId,
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            isVerified: true,
            subscriptionTier: true,
            profile: {
              select: {
                avatarMedia: {
                  select: { cdnUrl: true, thumbnailUrl: true },
                },
              },
            },
          },
        },
        media: {
          orderBy: { displayOrder: 'asc' },
          include: {
            media: {
              select: { id: true, cdnUrl: true, thumbnailUrl: true, mimeType: true },
            },
          },
        },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastPost = items[items.length - 1];
      nextCursor = Buffer.from(lastPost.createdAt.toISOString()).toString('base64');
    }

    const formatted = items.map((p) => this.formatPost(p));

    return { posts: formatted, nextCursor, hasMore };
  }

  async getUserPosts(
    viewerId: string,
    targetUserId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedPosts> {
    // Check if viewer is matched with target
    const match = await this.prisma.match.findFirst({
      where: {
        OR: [
          { userAId: viewerId, userBId: targetUserId },
          { userAId: targetUserId, userBId: viewerId },
        ],
        status: 'active',
      },
    });

    const isMatched = !!match || viewerId === targetUserId;

    // Check if target account is private
    const targetProfile = await this.prisma.userProfile.findUnique({
      where: { userId: targetUserId },
      select: { visibility: true },
    });

    if (targetProfile?.visibility === 'private' && !isMatched) {
      throw new ForbiddenException('This account is private');
    }

    // Determine which visibilities to include
    const allowedVisibilities: PostVisibility[] = isMatched
      ? [PostVisibility.public, PostVisibility.matches_only, PostVisibility.private]
      : [PostVisibility.public];

    // Viewer is always the owner, show all their posts
    if (viewerId === targetUserId) {
      allowedVisibilities.push(PostVisibility.private, PostVisibility.matches_only);
    }

    const uniqueVisibilities = [...new Set(allowedVisibilities)];

    let cursorDate: Date | undefined;
    if (cursor) {
      try {
        cursorDate = new Date(Buffer.from(cursor, 'base64').toString('utf8'));
      } catch {
        cursorDate = undefined;
      }
    }

    const posts = await this.prisma.post.findMany({
      where: {
        userId: targetUserId,
        isDeleted: false,
        visibility: { in: uniqueVisibilities },
        ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
        user: { deletedAt: null },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            isVerified: true,
            subscriptionTier: true,
            profile: {
              select: {
                avatarMedia: {
                  select: { cdnUrl: true, thumbnailUrl: true },
                },
              },
            },
          },
        },
        media: {
          orderBy: { displayOrder: 'asc' },
          include: {
            media: {
              select: { id: true, cdnUrl: true, thumbnailUrl: true, mimeType: true },
            },
          },
        },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastPost = items[items.length - 1];
      nextCursor = Buffer.from(lastPost.createdAt.toISOString()).toString('base64');
    }

    return {
      posts: items.map((p) => this.formatPost(p)),
      nextCursor,
      hasMore,
    };
  }

  private formatPost(post: any) {
    const avatarUrl =
      post.user?.profile?.avatarMedia?.cdnUrl ?? null;

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
