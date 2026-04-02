import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { NotificationType, SubscriptionTier } from '@prisma/client';

@Injectable()
export class PremiumExpiryWorker {
  private readonly logger = new Logger(PremiumExpiryWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Runs every hour to detect and expire subscriptions whose billing period has ended.
   */
  @Cron('0 * * * *')
  async checkExpiredSubscriptions(): Promise<void> {
    this.logger.log('Running checkExpiredSubscriptions...');

    const now = new Date();

    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: { lt: now },
      },
      select: {
        id: true,
        userId: true,
        tier: true,
        currentPeriodEnd: true,
      },
    });

    if (expiredSubscriptions.length === 0) {
      this.logger.debug('No expired subscriptions found');
      return;
    }

    this.logger.log(
      `Found ${expiredSubscriptions.length} expired subscriptions to process`,
    );

    for (const sub of expiredSubscriptions) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.subscription.update({
            where: { id: sub.id },
            data: { status: 'expired' },
          });

          await tx.user.update({
            where: { id: sub.userId },
            data: { subscriptionTier: SubscriptionTier.free },
          });
        });

        // Send expiry notification (fire and forget)
        this.notificationsService
          .createNotification(
            sub.userId,
            NotificationType.subscription,
            'Your Premium subscription has expired',
            'Renew your subscription to continue enjoying Premium features.',
            { subscriptionId: sub.id, previousTier: sub.tier },
          )
          .catch((err) =>
            this.logger.error(
              `Failed to send expiry notification to user ${sub.userId}: ${err.message}`,
            ),
          );

        this.logger.log(
          `Expired subscription ${sub.id} for user ${sub.userId}, downgraded to free tier`,
        );
      } catch (error: any) {
        this.logger.error(
          `Failed to process expired subscription ${sub.id}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  /**
   * Runs every day at 9am to send renewal reminder push notifications
   * to users whose subscriptions expire within the next 3 days.
   */
  @Cron('0 9 * * *')
  async sendRenewalReminders(): Promise<void> {
    this.logger.log('Running sendRenewalReminders...');

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const upcomingExpirations = await this.prisma.subscription.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: {
          gte: now,
          lte: threeDaysFromNow,
        },
        // Only remind once - check that we haven't sent a reminder recently
        // In production you'd track this; here we send on every run within window
      },
      select: {
        id: true,
        userId: true,
        tier: true,
        currentPeriodEnd: true,
      },
    });

    if (upcomingExpirations.length === 0) {
      this.logger.debug('No upcoming subscription expirations to remind');
      return;
    }

    this.logger.log(
      `Sending renewal reminders for ${upcomingExpirations.length} subscriptions`,
    );

    for (const sub of upcomingExpirations) {
      const daysLeft = Math.ceil(
        (sub.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      const dayText = daysLeft === 1 ? '1 day' : `${daysLeft} days`;

      try {
        await this.notificationsService.createNotification(
          sub.userId,
          NotificationType.subscription,
          'Your subscription is expiring soon',
          `Your Premium subscription expires in ${dayText}. Renew to keep all your benefits.`,
          {
            subscriptionId: sub.id,
            tier: sub.tier,
            expiresAt: sub.currentPeriodEnd.toISOString(),
            daysLeft,
          },
        );

        this.logger.debug(
          `Renewal reminder sent to user ${sub.userId} (expires in ${dayText})`,
        );
      } catch (error: any) {
        this.logger.error(
          `Failed to send renewal reminder to user ${sub.userId}: ${error.message}`,
        );
      }
    }
  }
}
