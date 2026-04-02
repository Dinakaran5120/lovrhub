import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { hashToken } from '@/common/utils/crypto.util';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DeviceInfo {
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class TokenService {
  private readonly refreshTokenTtlDays: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.refreshTokenTtlDays = Number(
      this.configService.get<string>('REFRESH_TOKEN_TTL_DAYS') ?? '30',
    );
  }

  /**
   * Issue an access + refresh token pair for the given user.
   */
  async generateTokenPair(
    user: User,
    deviceInfo?: DeviceInfo,
  ): Promise<TokenPair> {
    const jti = uuidv4();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? undefined,
      role: user.isAdmin ? 'admin' : 'user',
      tier: user.subscriptionTier as 'free' | 'premium' | 'premium_plus',
      status: user.accountStatus,
      jti,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m',
    });

    const refreshToken = uuidv4();
    await this.storeRefreshToken(user.id, refreshToken, deviceInfo);

    return { accessToken, refreshToken };
  }

  /**
   * Persist a hashed refresh token record in the database.
   */
  async storeRefreshToken(
    userId: string,
    token: string,
    deviceInfo?: DeviceInfo,
  ): Promise<void> {
    const tokenHash = await hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenTtlDays);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        deviceId: deviceInfo?.deviceId ?? null,
        deviceName: deviceInfo?.deviceName ?? null,
        ipAddress: deviceInfo?.ipAddress ?? null,
        userAgent: deviceInfo?.userAgent ?? null,
        expiresAt,
      },
    });
  }

  /**
   * Mark a single refresh token as revoked.
   */
  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = await hashToken(token);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revoke every active refresh token for a user (e.g. logout-all, password reset).
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Validate a raw refresh token UUID.
   * Returns the userId if valid; throws UnauthorizedException otherwise.
   */
  async validateRefreshToken(token: string): Promise<string> {
    const tokenHash = await hashToken(token);

    const record = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
      select: {
        userId: true,
        revokedAt: true,
        expiresAt: true,
      },
    });

    if (!record) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (record.revokedAt !== null) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    return record.userId;
  }

  /**
   * Rotate a refresh token: revoke the old one and issue a brand-new one.
   * Returns only the new raw token string (caller must re-generate access token separately).
   */
  async rotateRefreshToken(
    oldToken: string,
    userId: string,
    deviceInfo?: DeviceInfo,
  ): Promise<string> {
    // Revoke the old token first (detect reuse attacks)
    await this.revokeRefreshToken(oldToken);

    const newToken = uuidv4();
    await this.storeRefreshToken(userId, newToken, deviceInfo);
    return newToken;
  }

  /**
   * Sign a new access token without touching the RefreshToken table.
   * Useful when rotating refresh tokens – the caller already has the new
   * refresh token and only needs a fresh access token.
   */
  signAccessToken(user: User): string {
    const jti = uuidv4();
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? undefined,
      role: user.isAdmin ? 'admin' : 'user',
      tier: user.subscriptionTier as 'free' | 'premium' | 'premium_plus',
      status: user.accountStatus,
      jti,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m',
    });
  }
}
