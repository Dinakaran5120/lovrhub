import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AccountPurgeWorker {
  private readonly logger = new Logger(AccountPurgeWorker.name);
  private readonly s3: S3Client;
  private readonly s3Bucket: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.s3Bucket = this.config.getOrThrow<string>('AWS_S3_BUCKET');
  }

  /**
   * Runs every day at 2am to hard-delete users whose purge date has passed.
   */
  @Cron('0 2 * * *')
  async purgeDeletedAccounts(): Promise<void> {
    this.logger.log('Running purgeDeletedAccounts...');

    const now = new Date();

    const usersToDelete = await this.prisma.user.findMany({
      where: {
        deletedAt: { not: null },
        purgeAt: { lt: now },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        deletedAt: true,
        purgeAt: true,
      },
    });

    if (usersToDelete.length === 0) {
      this.logger.debug('No accounts due for purging');
      return;
    }

    this.logger.log(
      `Purging ${usersToDelete.length} deleted accounts`,
    );

    for (const user of usersToDelete) {
      try {
        await this.purgeUser(user);
      } catch (error: any) {
        this.logger.error(
          `Failed to purge user ${user.id}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  private async purgeUser(user: {
    id: string;
    email: string;
    displayName: string;
    deletedAt: Date | null;
    purgeAt: Date | null;
  }): Promise<void> {
    this.logger.log(`Purging user ${user.id} (${user.email})`);

    // Gather all media S3 keys before deletion
    const mediaRecords = await this.prisma.userMedia.findMany({
      where: { userId: user.id },
      select: { id: true, s3Key: true },
    });

    // Create final audit log entry before deleting the user
    await this.prisma.auditLog.create({
      data: {
        adminId: null, // system action
        targetUserId: user.id,
        action: 'system_purge_user',
        metadata: {
          userEmail: user.email,
          userDisplayName: user.displayName,
          deletedAt: user.deletedAt?.toISOString(),
          purgeAt: user.purgeAt?.toISOString(),
          mediaFilesCount: mediaRecords.length,
        },
      },
    });

    // Delete S3 media files in batches of 1000 (S3 DeleteObjects limit)
    if (mediaRecords.length > 0) {
      await this.deleteS3Files(
        mediaRecords.map((m) => m.s3Key).filter(Boolean),
      );
    }

    // Hard delete the user record (Prisma cascades will handle related records)
    await this.prisma.user.delete({
      where: { id: user.id },
    });

    this.logger.log(
      `Successfully purged user ${user.id}, deleted ${mediaRecords.length} media files`,
    );
  }

  private async deleteS3Files(s3Keys: string[]): Promise<void> {
    if (s3Keys.length === 0) return;

    const BATCH_SIZE = 1000;

    for (let i = 0; i < s3Keys.length; i += BATCH_SIZE) {
      const batch = s3Keys.slice(i, i + BATCH_SIZE);

      const objects: ObjectIdentifier[] = batch.map((key) => ({ Key: key }));

      try {
        await this.s3.send(
          new DeleteObjectsCommand({
            Bucket: this.s3Bucket,
            Delete: { Objects: objects, Quiet: true },
          }),
        );

        this.logger.debug(
          `Deleted ${batch.length} S3 objects (batch ${Math.floor(i / BATCH_SIZE) + 1})`,
        );
      } catch (error: any) {
        this.logger.error(
          `Failed to delete S3 batch: ${error.message}`,
          error.stack,
        );
        // Continue even if S3 deletion fails; DB will still be purged
      }
    }
  }

  /**
   * Runs every Sunday at 3am to deactivate profiles inactive for 90+ days.
   */
  @Cron('0 3 * * 0')
  async deactivateInactiveProfiles(): Promise<void> {
    this.logger.log('Running deactivateInactiveProfiles...');

    const ninetyDaysAgo = new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000,
    );

    const inactiveUsers = await this.prisma.user.findMany({
      where: {
        accountStatus: 'active',
        lastActiveAt: { lt: ninetyDaysAgo },
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        lastActiveAt: true,
      },
    });

    if (inactiveUsers.length === 0) {
      this.logger.debug('No inactive profiles to deactivate');
      return;
    }

    this.logger.log(
      `Deactivating ${inactiveUsers.length} inactive profiles`,
    );

    const userIds = inactiveUsers.map((u) => u.id);

    await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { accountStatus: 'inactive' },
    });

    this.logger.log(
      `Deactivated ${inactiveUsers.length} profiles. They will no longer appear in discover.`,
    );

    // Send reactivation emails
    for (const user of inactiveUsers) {
      try {
        await this.sendReactivationEmail(user);
      } catch (error: any) {
        this.logger.error(
          `Failed to send reactivation email to user ${user.id}: ${error.message}`,
        );
      }
    }
  }

  private async sendReactivationEmail(user: {
    id: string;
    email: string;
    displayName: string;
    lastActiveAt: Date | null;
  }): Promise<void> {
    // In production: use an email service such as SendGrid, Resend, or SES.
    // The email service would be injected and called here.
    this.logger.log(
      `[Email] Reactivation email queued for user ${user.id} (${user.email}) - last active: ${user.lastActiveAt?.toISOString() ?? 'never'}`,
    );

    // Example: await this.emailService.sendTemplate(user.email, 'reactivation', {
    //   displayName: user.displayName,
    //   loginUrl: `${this.config.get('APP_URL')}/login`,
    // });
  }
}
