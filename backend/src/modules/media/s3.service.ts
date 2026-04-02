import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly cdnDomain: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
    this.cdnDomain = this.configService.getOrThrow<string>('AWS_CLOUDFRONT_DOMAIN');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Generates a presigned PUT URL for direct client-to-S3 upload.
   * Content-Type is enforced. Content-Length-Range conditions are applied
   * via a presigned POST policy when using PutObject (max size enforced server-side
   * by checking after upload, or use createPresignedPost for strict enforcement).
   */
  async generatePresignedUploadUrl(
    key: string,
    mimeType: string,
    maxSizeBytes: number,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
      // Metadata lets us double-check on Lambda trigger
      Metadata: {
        'max-size-bytes': maxSizeBytes.toString(),
      },
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 600, // 10 minutes
      });
      return signedUrl;
    } catch (err) {
      throw new InternalServerErrorException('Failed to generate presigned upload URL.');
    }
  }

  /**
   * Deletes an object from S3 by its key.
   */
  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      // Log but don't throw — object may already be gone
      console.error(`[S3Service] Failed to delete object ${key}:`, err);
    }
  }

  /**
   * Generates a namespaced S3 key.
   * Format: {purpose}/{userId}/{timestamp}-{uuid}.{ext}
   */
  generateS3Key(userId: string, purpose: string, filename: string): string {
    const ext = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, '') || 'bin';
    const timestamp = Date.now();
    const id = uuidv4();
    return `${purpose}/${userId}/${timestamp}-${id}.${ext}`;
  }

  /**
   * Returns the CloudFront CDN URL for a given S3 key.
   */
  getCdnUrl(s3Key: string): string {
    const domain = this.cdnDomain.replace(/\/+$/, '');
    return `https://${domain}/${s3Key}`;
  }

  /**
   * Returns the thumbnail CDN URL (assumes Lambda created a thumb at thumbs/{key}).
   */
  getThumbnailUrl(s3Key: string): string {
    const domain = this.cdnDomain.replace(/\/+$/, '');
    const thumbKey = `thumbs/${s3Key}`;
    return `https://${domain}/${thumbKey}`;
  }

  /**
   * Checks whether an object exists in S3.
   */
  async objectExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
}
