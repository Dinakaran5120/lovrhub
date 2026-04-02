import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Block } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

export interface BlockedUserItem {
  id: string;
  blockedAt: Date;
  reason: string | null;
  user: {
    id: string;
    displayName: string;
    profilePhotoUrl: string | null;
  };
}

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(
    blockerId: string,
    blockedId: string,
    reason?: string,
  ): Promise<Block> {
    if (blockerId === blockedId) {
      throw new BadRequestException('You cannot block yourself');
    }

    // Verify the target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: blockedId, deletedAt: null },
    });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Idempotent: return existing block if already blocked
    const existing = await this.prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
    if (existing) {
      return existing;
    }

    // Run all side effects in a transaction
    const [block] = await this.prisma.$transaction(async (tx) => {
      // Create the block record
      const newBlock = await tx.block.create({
        data: { blockerId, blockedId, reason: reason ?? null },
      });

      // Find any active match and mark it as blocked
      const match = await tx.match.findFirst({
        where: {
          OR: [
            { userAId: blockerId, userBId: blockedId },
            { userAId: blockedId, userBId: blockerId },
          ],
          status: 'active',
          deletedAt: null,
        },
        include: { conversation: { select: { id: true } } },
      });

      if (match) {
        await tx.match.update({
          where: { id: match.id },
          data: { status: 'blocked' },
        });

        // Archive the shared conversation for both participants
        if (match.conversation) {
          const convId = match.conversation.id;
          await tx.conversationParticipant.updateMany({
            where: {
              conversationId: convId,
              userId: { in: [blockerId, blockedId] },
            },
            data: { isArchived: true },
          });
        }
      }

      return [newBlock];
    });

    return block;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const block = await this.prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });

    if (!block) {
      throw new NotFoundException('Block record not found');
    }

    await this.prisma.block.delete({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
  }

  async getBlockedUsers(blockerId: string): Promise<BlockedUserItem[]> {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId },
      orderBy: { createdAt: 'desc' },
      include: {
        blocked: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    return blocks.map((b) => ({
      id: b.id,
      blockedAt: b.createdAt,
      reason: b.reason,
      user: {
        id: b.blocked.id,
        displayName: b.blocked.profile?.displayName ?? 'Unknown',
        profilePhotoUrl: b.blocked.profile?.profilePhotoUrl ?? null,
      },
    }));
  }

  async isBlocked(userId1: string, userId2: string): Promise<boolean> {
    const count = await this.prisma.block.count({
      where: {
        OR: [
          { blockerId: userId1, blockedId: userId2 },
          { blockerId: userId2, blockedId: userId1 },
        ],
      },
    });
    return count > 0;
  }
}
