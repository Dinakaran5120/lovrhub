import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import { Twilio } from 'twilio';
import { RedisService } from '@/redis/redis.service';
import { generateOtp } from '@/common/utils/crypto.util';

export interface OtpVerifyResult {
  success: boolean;
  attemptsLeft?: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly keyPrefix: string = 'lovrhub';
  private readonly otpTtl: number;
  private readonly maxAttempts: number;
  private readonly cooldownSeconds: number = 60;
  private readonly sesClient: SESClient;
  private readonly twilioClient: Twilio;
  private readonly fromEmail: string;
  private readonly fromPhone: string;

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {
    this.otpTtl = Number(this.config.get<string>('OTP_EXPIRY_SECONDS') ?? '300');
    this.maxAttempts = Number(
      this.config.get<string>('OTP_MAX_ATTEMPTS') ?? '3',
    );
    this.fromEmail = this.config.getOrThrow<string>('SES_FROM_EMAIL');
    this.fromPhone = this.config.getOrThrow<string>('TWILIO_FROM_PHONE');

    this.sesClient = new SESClient({
      region: this.config.get<string>('AWS_REGION') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.twilioClient = new Twilio(
      this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  // ─── Key helpers ────────────────────────────────────────────────────────────

  private otpKey(userId: string): string {
    return `${this.keyPrefix}:otp:${userId}`;
  }

  private attemptsKey(userId: string): string {
    return `${this.keyPrefix}:otp:attempts:${userId}`;
  }

  private cooldownKey(userId: string): string {
    return `${this.keyPrefix}:otp:cooldown:${userId}`;
  }

  // ─── Public methods ──────────────────────────────────────────────────────────

  /**
   * Generate a 6-digit OTP, store it in Redis, and dispatch an email via SES.
   */
  async sendEmailOtp(userId: string, email: string): Promise<void> {
    const otp = generateOtp(6);
    await this.redis.setex(this.otpKey(userId), this.otpTtl, otp);

    const params: SendEmailCommandInput = {
      Source: this.fromEmail,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: {
          Data: 'Your LovRHub verification code',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `Your verification code is: ${otp}\n\nThis code expires in ${Math.floor(this.otpTtl / 60)} minutes. Do not share it with anyone.`,
            Charset: 'UTF-8',
          },
          Html: {
            Data: `
              <p>Hi there,</p>
              <p>Your LovRHub verification code is:</p>
              <h2 style="letter-spacing:6px;">${otp}</h2>
              <p>This code expires in <strong>${Math.floor(this.otpTtl / 60)} minutes</strong>.</p>
              <p>If you did not request this, please ignore this email.</p>
            `,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      await this.sesClient.send(new SendEmailCommand(params));
    } catch (err) {
      this.logger.error(
        `Failed to send email OTP to ${email}: ${(err as Error).message}`,
      );
      throw new ServiceUnavailableException(
        'Unable to send verification email. Please try again later.',
      );
    }
  }

  /**
   * Generate a 6-digit OTP, store it in Redis, and dispatch an SMS via Twilio.
   */
  async sendPhoneOtp(
    userId: string,
    phone: string,
    countryCode: string,
  ): Promise<void> {
    const otp = generateOtp(6);
    await this.redis.setex(this.otpKey(userId), this.otpTtl, otp);

    const toNumber = `${countryCode}${phone}`;

    try {
      await this.twilioClient.messages.create({
        from: this.fromPhone,
        to: toNumber,
        body: `Your LovRHub verification code is: ${otp}. It expires in ${Math.floor(this.otpTtl / 60)} minutes.`,
      });
    } catch (err) {
      this.logger.error(
        `Failed to send SMS OTP to ${toNumber}: ${(err as Error).message}`,
      );
      throw new ServiceUnavailableException(
        'Unable to send verification SMS. Please try again later.',
      );
    }
  }

  /**
   * Verify an OTP submitted by the user.
   * - Enforces max-attempt lockout.
   * - Uses timing-safe comparison to prevent timing attacks.
   * - Clears Redis keys on success.
   */
  async verifyOtp(
    userId: string,
    providedOtp: string,
  ): Promise<OtpVerifyResult> {
    // Check attempt count first
    const currentAttempts = await this.getAttempts(userId);
    if (currentAttempts >= this.maxAttempts) {
      // Delete the OTP so a fresh one must be requested
      await this.redis.del(this.otpKey(userId));
      throw new BadRequestException(
        `Maximum OTP attempts exceeded. Please request a new code.`,
      );
    }

    const storedOtp = await this.redis.get(this.otpKey(userId));
    if (!storedOtp) {
      throw new BadRequestException(
        'OTP has expired or does not exist. Please request a new code.',
      );
    }

    // Timing-safe comparison
    const storedBuf = Buffer.from(storedOtp.padEnd(6, '\0'));
    const providedBuf = Buffer.from(providedOtp.padEnd(6, '\0'));
    const isValid =
      storedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(storedBuf, providedBuf);

    if (isValid) {
      // Clean up on success
      await Promise.all([
        this.redis.del(this.otpKey(userId)),
        this.redis.del(this.attemptsKey(userId)),
        this.redis.del(this.cooldownKey(userId)),
      ]);
      return { success: true };
    }

    // Increment attempts counter
    const newAttempts = await this.incrementAttempts(userId);
    const attemptsLeft = this.maxAttempts - newAttempts;

    if (attemptsLeft <= 0) {
      await this.redis.del(this.otpKey(userId));
      throw new BadRequestException(
        'Maximum OTP attempts exceeded. Please request a new code.',
      );
    }

    return { success: false, attemptsLeft };
  }

  /**
   * Re-send an OTP after checking that the cooldown window has elapsed.
   * Determines the channel (email vs phone) by looking at which key previously existed.
   * Callers must pass userId along with channel + contact so this service can re-dispatch.
   */
  async resendOtp(
    userId: string,
    channel: 'email' | 'phone',
    contact: string,
    countryCode?: string,
  ): Promise<void> {
    const cooldownKey = this.cooldownKey(userId);
    const isOnCooldown = await this.redis.exists(cooldownKey);

    if (isOnCooldown) {
      throw new BadRequestException(
        `Please wait ${this.cooldownSeconds} seconds before requesting a new code.`,
      );
    }

    // Set cooldown before dispatching to prevent double-sends
    await this.redis.setex(cooldownKey, this.cooldownSeconds, '1');

    // Reset attempt counter for fresh OTP
    await this.redis.del(this.attemptsKey(userId));

    if (channel === 'email') {
      await this.sendEmailOtp(userId, contact);
    } else {
      await this.sendPhoneOtp(userId, contact, countryCode ?? '+1');
    }
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async getAttempts(userId: string): Promise<number> {
    const raw = await this.redis.get(this.attemptsKey(userId));
    return raw ? parseInt(raw, 10) : 0;
  }

  private async incrementAttempts(userId: string): Promise<number> {
    const key = this.attemptsKey(userId);
    const current = await this.getAttempts(userId);
    const next = current + 1;
    // Keep the attempts counter alive for 1 hour so brute-force persists across
    // re-requests within the same window.
    await this.redis.setex(key, 3600, String(next));
    return next;
  }
}
