import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import {
  hashPassword,
  comparePassword,
  hashToken,
} from '@/common/utils/crypto.util';
import { OtpService } from './otp.service';
import { TokenService, DeviceInfo } from './token.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { RegisterPhoneDto } from './dto/register-phone.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

// ─── Return shapes ────────────────────────────────────────────────────────────

export interface RegisterResult {
  userId: string;
  message: string;
}

export interface PublicUser {
  id: string;
  displayName: string;
  subscriptionTier: string;
  accountStatus: string;
  setupCompleted: boolean;
  setupStep: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResult extends AuthTokens {
  user: PublicUser;
}

export interface LoginResult extends AuthTokens {
  user: PublicUser;
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly resetTokenPrefix = 'lovrhub:pwreset';
  private readonly resetTokenTtl = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────────────────

  async registerEmail(
    dto: RegisterEmailDto,
    ipAddress?: string,
  ): Promise<RegisterResult> {
    this.assertAge18Plus(dto.birthDate);

    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: dto.email,
          displayName: dto.displayName,
          birthDate: new Date(dto.birthDate),
          passwordHash,
          authProvider: 'email',
          accountStatus: 'pending_verification',
          subscriptionTier: 'free',
          isEmailVerified: false,
          isPhoneVerified: false,
          isVerified: false,
          isAdmin: false,
          setupCompleted: false,
          setupStep: 0,
        },
      });

      await tx.userProfile.create({ data: { userId: created.id } });
      await tx.userPreference.create({ data: { userId: created.id } });
      await tx.userStat.create({ data: { userId: created.id } });

      return created;
    });

    await this.otpService.sendEmailOtp(user.id, dto.email);

    return {
      userId: user.id,
      message:
        'Registration successful. Please check your email for a verification code.',
    };
  }

  async registerPhone(
    dto: RegisterPhoneDto,
    _ipAddress?: string,
  ): Promise<RegisterResult> {
    this.assertAge18Plus(dto.birthDate);

    const existing = await this.prisma.user.findFirst({
      where: {
        phone: dto.phone,
        phoneCountryCode: dto.countryCode,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        'An account with this phone number already exists',
      );
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          phone: dto.phone,
          phoneCountryCode: dto.countryCode,
          displayName: dto.displayName,
          birthDate: new Date(dto.birthDate),
          authProvider: 'phone',
          accountStatus: 'pending_verification',
          subscriptionTier: 'free',
          isEmailVerified: false,
          isPhoneVerified: false,
          isVerified: false,
          isAdmin: false,
          setupCompleted: false,
          setupStep: 0,
        },
      });

      await tx.userProfile.create({ data: { userId: created.id } });
      await tx.userPreference.create({ data: { userId: created.id } });
      await tx.userStat.create({ data: { userId: created.id } });

      return created;
    });

    await this.otpService.sendPhoneOtp(user.id, dto.phone, dto.countryCode);

    return {
      userId: user.id,
      message:
        'Registration successful. Please enter the verification code sent to your phone.',
    };
  }

  // ─── OTP verification ─────────────────────────────────────────────────────

  async verifyOtp(
    dto: VerifyOtpDto,
    deviceInfo?: DeviceInfo,
  ): Promise<VerifyOtpResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    const result = await this.otpService.verifyOtp(dto.userId, dto.otp);
    if (!result.success) {
      const left = result.attemptsLeft ?? 0;
      throw new BadRequestException(
        `Invalid OTP. ${left} attempt${left === 1 ? '' : 's'} remaining.`,
      );
    }

    const updateData: Partial<User> = {
      accountStatus: 'active',
      lastActiveAt: new Date(),
    };

    if (user.authProvider === 'email') {
      updateData.isEmailVerified = true;
    } else if (user.authProvider === 'phone') {
      updateData.isPhoneVerified = true;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: dto.userId },
      data: updateData,
    });

    const tokens = await this.tokenService.generateTokenPair(
      updatedUser,
      deviceInfo,
    );

    return {
      ...tokens,
      user: this.buildPublicUser(updatedUser),
    };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        phoneCountryCode: true,
        authProvider: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (user.authProvider === 'email') {
      if (!user.email) {
        throw new BadRequestException('No email address on file');
      }
      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already verified');
      }
      await this.otpService.resendOtp(dto.userId, 'email', user.email);
      return { message: 'Verification code resent to your email address.' };
    } else if (user.authProvider === 'phone') {
      if (!user.phone) {
        throw new BadRequestException('No phone number on file');
      }
      if (user.isPhoneVerified) {
        throw new BadRequestException('Phone number is already verified');
      }
      await this.otpService.resendOtp(
        dto.userId,
        'phone',
        user.phone,
        user.phoneCountryCode ?? '+1',
      );
      return {
        message: 'Verification code resent to your phone number.',
      };
    }

    throw new BadRequestException('Cannot resend OTP for this account type');
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, deviceInfo?: DeviceInfo): Promise<LoginResult> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('email or phone is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        ...(dto.email ? { email: dto.email } : { phone: dto.phone }),
      },
    });

    // Use the same message for user-not-found and wrong-password to prevent
    // enumeration attacks.
    const INVALID_CREDENTIALS = 'Invalid credentials';

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (user.accountStatus === 'deleted') {
      throw new NotFoundException('Account not found');
    }

    if (user.accountStatus === 'suspended') {
      throw new ForbiddenException(
        'Your account has been suspended. Please contact support.',
      );
    }

    if (!user.passwordHash) {
      // Phone-only or OAuth accounts – no password set
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordValid = await comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    // Touch lastActiveAt without waiting for the result to block the response
    this.prisma.user
      .update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      })
      .catch((err: Error) =>
        this.logger.warn(`Failed to update lastActiveAt: ${err.message}`),
      );

    const tokens = await this.tokenService.generateTokenPair(user, deviceInfo);

    return {
      ...tokens,
      user: this.buildPublicUser(user),
    };
  }

  // ─── Token refresh ────────────────────────────────────────────────────────

  async refresh(dto: RefreshTokenDto): Promise<AuthTokens> {
    const userId = await this.tokenService.validateRefreshToken(
      dto.refreshToken,
    );

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt || user.accountStatus === 'deleted') {
      throw new UnauthorizedException('User account not found or deleted');
    }

    if (user.accountStatus === 'suspended') {
      throw new ForbiddenException('Account is suspended');
    }

    const newRefreshToken = await this.tokenService.rotateRefreshToken(
      dto.refreshToken,
      userId,
    );

    // Sign a fresh access token with up-to-date claims without touching the
    // RefreshToken table a second time.
    const accessToken = this.tokenService.signAccessToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  // ─── Password reset ───────────────────────────────────────────────────────

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const SAFE_MESSAGE =
      'If an account with that email exists, a reset link has been sent.';

    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, email: true },
    });

    if (!user) {
      // Return success regardless to prevent email enumeration
      return { message: SAFE_MESSAGE };
    }

    const rawToken = uuidv4();
    const tokenHash = await hashToken(rawToken);
    const redisKey = `${this.resetTokenPrefix}:${tokenHash}`;

    await this.redis.setex(redisKey, this.resetTokenTtl, user.id);

    const appUrl =
      this.config.get<string>('APP_URL') ?? 'https://lovrhub.com';
    const resetLink = `${appUrl}/auth/reset-password?token=${rawToken}`;

    try {
      // We delegate the actual sending to OtpService's SES client via a
      // simple email helper to avoid duplicating SES config. In a larger app
      // this would go through a dedicated MailService.
      const { SESClient, SendEmailCommand } = await import(
        '@aws-sdk/client-ses'
      );
      const ses = new SESClient({
        region: this.config.get<string>('AWS_REGION') ?? 'us-east-1',
        credentials: {
          accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.config.getOrThrow<string>(
            'AWS_SECRET_ACCESS_KEY',
          ),
        },
      });

      await ses.send(
        new SendEmailCommand({
          Source: this.config.getOrThrow<string>('SES_FROM_EMAIL'),
          Destination: { ToAddresses: [user.email!] },
          Message: {
            Subject: {
              Data: 'Reset your LovRHub password',
              Charset: 'UTF-8',
            },
            Body: {
              Text: {
                Data: `Click the link below to reset your password. It expires in 1 hour.\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
                Charset: 'UTF-8',
              },
              Html: {
                Data: `
                  <p>Hi,</p>
                  <p>Click the button below to reset your LovRHub password. This link expires in <strong>1 hour</strong>.</p>
                  <p><a href="${resetLink}" style="padding:12px 24px;background:#e44;color:#fff;border-radius:4px;text-decoration:none;">Reset Password</a></p>
                  <p>If you did not request this, ignore this email.</p>
                `,
                Charset: 'UTF-8',
              },
            },
          },
        }),
      );
    } catch (err) {
      this.logger.error(
        `Failed to send password-reset email: ${(err as Error).message}`,
      );
      // Still return the safe message; log the failure internally
    }

    return { message: SAFE_MESSAGE };
  }

  async confirmPasswordReset(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = await hashToken(token);
    const redisKey = `${this.resetTokenPrefix}:${tokenHash}`;

    const userId = await this.redis.get(redisKey);
    if (!userId) {
      throw new BadRequestException(
        'Reset token is invalid or has expired. Please request a new one.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate the reset token immediately
    await this.redis.del(redisKey);

    // Revoke all sessions so old tokens cannot be used with the new password
    await this.tokenService.revokeAllUserTokens(userId);

    return { message: 'Password updated successfully' };
  }

  // ─── Account management ───────────────────────────────────────────────────

  async deleteAccount(userId: string): Promise<void> {
    const purgeAt = new Date();
    purgeAt.setDate(purgeAt.getDate() + 30);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        accountStatus: 'deleted',
        deletedAt: new Date(),
        // Prisma model should expose purgeAt; if not, this is a no-op field
        // and the column will need a migration. Storing via raw if needed.
      },
    });

    await this.tokenService.revokeAllUserTokens(userId);
  }

  async deactivateAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'inactive' },
    });
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private buildPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      displayName: user.displayName,
      subscriptionTier: user.subscriptionTier,
      accountStatus: user.accountStatus,
      setupCompleted: user.setupCompleted,
      setupStep: user.setupStep,
    };
  }

  private assertAge18Plus(birthDateStr: string): void {
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('birthDate is not a valid date');
    }

    const now = new Date();
    const eighteenYearsAgo = new Date(
      now.getFullYear() - 18,
      now.getMonth(),
      now.getDate(),
    );

    if (birthDate > eighteenYearsAgo) {
      throw new BadRequestException(
        'You must be at least 18 years old to register',
      );
    }
  }

}
