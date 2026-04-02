import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

const AUTO_BLOCK_THRESHOLD = 3;
const PRIORITY_REPORT_THRESHOLD = 10;
const DUPLICATE_WINDOW_DAYS = 7;
const PRIORITY_PREFIX = '[PRIORITY] ';

export interface CreateReportResult {
  id: string;
  status: string;
  message: string;
}

export interface ReportListItem {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description: string | null;
  isReviewed: boolean;
  reviewedAt: Date | null;
  createdAt: Date;
}

export interface UserReportsResult {
  submitted: ReportListItem[];
  received: ReportListItem[];
  total: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createReport(
    reporterId: string,
    dto: CreateReportDto,
  ): Promise<CreateReportResult> {
    const { reportedUserId, reason, description, reportedPostId } = dto;

    // Cannot report yourself
    if (reporterId === reportedUserId) {
      throw new BadRequestException('You cannot report yourself');
    }

    // Verify the reported user exists
    const reportedUser = await this.prisma.user.findUnique({
      where: { id: reportedUserId, deletedAt: null },
    });
    if (!reportedUser) {
      throw new NotFoundException('Reported user not found');
    }

    // Check for duplicate report within 7 days
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - DUPLICATE_WINDOW_DAYS);

    const duplicate = await this.prisma.report.findFirst({
      where: {
        reporterId,
        reportedId: reportedUserId,
        createdAt: { gte: windowStart },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (duplicate) {
      return {
        id: duplicate.id,
        status: 'pending',
        message: 'Report submitted. We will review it shortly.',
      };
    }

    // If reportedPostId provided: verify post exists and belongs to reportedUserId
    if (reportedPostId) {
      const post = await this.prisma.post.findFirst({
        where: {
          id: reportedPostId,
          userId: reportedUserId,
          deletedAt: null,
        },
      });
      if (!post) {
        throw new NotFoundException(
          'Reported post not found or does not belong to the reported user',
        );
      }
    }

    // Count total reports against this user to detect priority cases
    const totalReportsAgainstUser = await this.prisma.report.count({
      where: {
        reportedId: reportedUserId,
        deletedAt: null,
      },
    });

    const isPriority = totalReportsAgainstUser + 1 >= PRIORITY_REPORT_THRESHOLD;

    // Prepend priority flag in description if applicable
    let finalDescription = description ?? null;
    if (isPriority) {
      finalDescription = `${PRIORITY_PREFIX}${finalDescription ?? ''}`.trimEnd();
    }

    // Create the report
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedId: reportedUserId,
        reason,
        description: finalDescription,
        refType: reportedPostId ? 'post' : null,
        refId: reportedPostId ?? null,
      },
    });

    // Auto-block after threshold: count how many distinct reports THIS reporter
    // has made against this user
    const reporterReportCount = await this.prisma.report.count({
      where: {
        reporterId,
        reportedId: reportedUserId,
        deletedAt: null,
      },
    });

    if (reporterReportCount >= AUTO_BLOCK_THRESHOLD) {
      await this.applyAutoBlock(reporterId, reportedUserId);
    }

    this.logger.log(
      `Report created id=${report.id} reporter=${reporterId} reported=${reportedUserId} reason=${reason} priority=${isPriority}`,
    );

    return {
      id: report.id,
      status: 'pending',
      message: 'Report submitted. We will review it shortly.',
    };
  }

  async getUserReports(
    userId: string,
    page: number,
    limit: number,
  ): Promise<UserReportsResult> {
    const skip = (page - 1) * limit;

    const [submitted, received, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: { reporterId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          reporterId: true,
          reportedId: true,
          reason: true,
          description: true,
          isReviewed: true,
          reviewedAt: true,
          createdAt: true,
        },
      }),
      this.prisma.report.findMany({
        where: { reportedId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          reporterId: true,
          reportedId: true,
          reason: true,
          description: true,
          isReviewed: true,
          reviewedAt: true,
          createdAt: true,
        },
      }),
      this.prisma.report.count({
        where: {
          OR: [{ reporterId: userId }, { reportedId: userId }],
          deletedAt: null,
        },
      }),
    ]);

    return { submitted, received, total };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async applyAutoBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<void> {
    try {
      const existing = await this.prisma.block.findUnique({
        where: { blockerId_blockedId: { blockerId, blockedId } },
      });
      if (existing) return;

      await this.prisma.$transaction(async (tx) => {
        await tx.block.create({
          data: {
            blockerId,
            blockedId,
            reason: 'auto-block: multiple reports',
          },
        });

        // Deactivate any active match
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

          if (match.conversation) {
            await tx.conversationParticipant.updateMany({
              where: {
                conversationId: match.conversation.id,
                userId: { in: [blockerId, blockedId] },
              },
              data: { isArchived: true },
            });
          }
        }
      });

      this.logger.log(`Auto-block applied: ${blockerId} → ${blockedId}`);
    } catch (err) {
      this.logger.error(
        `applyAutoBlock(${blockerId}, ${blockedId}) failed: ${(err as Error).message}`,
      );
    }
  }
}
