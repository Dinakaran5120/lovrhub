import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';

type ReportDecision = 'dismiss' | 'warn' | 'suspend' | 'delete';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getUsers(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.accountStatus = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          displayName: true,
          email: true,
          phone: true,
          accountStatus: true,
          subscriptionTier: true,
          isVerified: true,
          createdAt: true,
          deletedAt: true,
          profile: {
            select: {
              avatarMedia: {
                select: { thumbnailUrl: true },
              },
            },
          },
          _count: {
            select: {
              posts: true,
              matchesAsUserA: true,
              matchesAsUserB: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            avatarMedia: true,
          },
        },
        _count: {
          select: {
            posts: true,
            matchesAsUserA: true,
            matchesAsUserB: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [reports, auditLogs, subscription] = await Promise.all([
      this.prisma.report.findMany({
        where: { reportedUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          reporter: {
            select: { id: true, displayName: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.findMany({
        where: { targetUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          admin: {
            select: { id: true, displayName: true, email: true },
          },
        },
      }),
      this.prisma.subscription.findFirst({
        where: { userId, status: { in: ['active', 'past_due'] } },
        orderBy: { currentPeriodEnd: 'desc' },
      }),
    ]);

    return {
      user,
      stats: {
        postsCount: user._count.posts,
        matchesCount: user._count.matchesAsUserA + user._count.matchesAsUserB,
      },
      reports,
      auditLogs,
      subscription,
    };
  }

  async suspendUser(adminId: string, userId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { accountStatus: 'suspended' },
      });

      await tx.auditLog.create({
        data: {
          adminId,
          targetUserId: userId,
          action: 'suspend_user',
          reason,
          metadata: { previousStatus: user.accountStatus },
        },
      });
    });

    // Revoke all refresh tokens by deleting from Redis
    await this.revokeAllRefreshTokens(userId);

    this.logger.log(`User ${userId} suspended by admin ${adminId}: ${reason}`);

    return { message: 'User suspended successfully' };
  }

  async unsuspendUser(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.accountStatus !== 'suspended') {
      throw new BadRequestException('User is not currently suspended');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { accountStatus: 'active' },
      });

      await tx.auditLog.create({
        data: {
          adminId,
          targetUserId: userId,
          action: 'unsuspend_user',
          metadata: {},
        },
      });
    });

    this.logger.log(`User ${userId} unsuspended by admin ${adminId}`);

    return { message: 'User unsuspended successfully' };
  }

  async deleteUserAdmin(adminId: string, userId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.$transaction(async (tx) => {
      // Log before deletion
      await tx.auditLog.create({
        data: {
          adminId,
          targetUserId: userId,
          action: 'admin_delete_user',
          reason,
          metadata: {
            userEmail: user.email,
            userDisplayName: user.displayName,
          },
        },
      });

      // Accelerated soft delete: mark as deleted with immediate purge date
      await tx.user.update({
        where: { id: userId },
        data: {
          accountStatus: 'deleted',
          deletedAt: new Date(),
          purgeAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // purge in 24 hours
        },
      });
    });

    // Revoke all tokens
    await this.revokeAllRefreshTokens(userId);

    this.logger.log(`User ${userId} admin-deleted by admin ${adminId}: ${reason}`);

    return { message: 'User scheduled for deletion' };
  }

  async getPendingReports(page: number, limit: number, status: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: {
              id: true,
              displayName: true,
              email: true,
              profile: {
                select: {
                  avatarMedia: { select: { thumbnailUrl: true } },
                },
              },
            },
          },
          reportedUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
              accountStatus: true,
              profile: {
                select: {
                  avatarMedia: { select: { thumbnailUrl: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async reviewReport(
    adminId: string,
    reportId: string,
    decision: ReportDecision,
    notes?: string,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const reportedUserId = report.reportedUserId;

    await this.prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id: reportId },
        data: {
          status: decision === 'dismiss' ? 'dismissed' : 'actioned',
          reviewedAt: new Date(),
          reviewedByAdminId: adminId,
          reviewNotes: notes ?? null,
        },
      });

      await tx.auditLog.create({
        data: {
          adminId,
          targetUserId: reportedUserId,
          action: `report_review_${decision}`,
          metadata: { reportId, decision, notes },
        },
      });
    });

    // Execute consequences
    if (decision === 'suspend') {
      await this.suspendUser(
        adminId,
        reportedUserId,
        `Report actioned: ${notes ?? 'Policy violation'}`,
      );
    } else if (decision === 'delete') {
      await this.deleteUserAdmin(
        adminId,
        reportedUserId,
        `Report actioned: ${notes ?? 'Severe policy violation'}`,
      );
    } else if (decision === 'warn') {
      // Could emit a warning notification here
      this.logger.log(
        `Warning issued to user ${reportedUserId} for report ${reportId}`,
      );
    }

    return { message: `Report ${decision}ed successfully` };
  }

  async getDashboardStats() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeToday,
      newThisWeek,
      matchesToday,
      pendingReports,
      premiumCount,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: {
          lastActiveAt: { gte: startOfToday },
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: { gte: startOfWeek },
          deletedAt: null,
        },
      }),
      this.prisma.match.count({
        where: {
          createdAt: { gte: startOfToday },
        },
      }),
      this.prisma.report.count({
        where: { status: 'pending' },
      }),
      this.prisma.user.count({
        where: {
          subscriptionTier: { in: ['premium', 'premium_plus'] },
          deletedAt: null,
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        activeToday,
        newThisWeek,
      },
      matches: {
        today: matchesToday,
      },
      reports: {
        pending: pendingReports,
      },
      revenue: {
        premiumSubscribers: premiumCount,
      },
    };
  }

  async getAuditLogs(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) {
      where.targetUserId = userId;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: { id: true, displayName: true, email: true },
          },
          targetUser: {
            select: { id: true, displayName: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private async revokeAllRefreshTokens(userId: string): Promise<void> {
    try {
      const client = this.redis.getClient();
      const pattern = `lovrhub:refresh_token:${userId}:*`;
      const keys = await client.keys(pattern);

      if (keys.length > 0) {
        await client.del(...keys);
      }

      // Also invalidate any session tokens
      const sessionKeys = await client.keys(`lovrhub:session:${userId}:*`);
      if (sessionKeys.length > 0) {
        await client.del(...sessionKeys);
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to revoke refresh tokens for user ${userId}: ${error.message}`,
      );
    }
  }
}
