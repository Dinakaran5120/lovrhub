import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  region: process.env.AWS_REGION ?? 'us-east-1',
  bucket: process.env.AWS_S3_BUCKET ?? 'lovrhub-media-dev',
  cloudfrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN ?? '',
  sesFromEmail: process.env.AWS_SES_FROM_EMAIL ?? 'no-reply@lovrhub.com',
}));
