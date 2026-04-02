import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { RegisterPhoneDto } from './dto/register-phone.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  RequestPasswordResetDto,
  ConfirmPasswordResetDto,
} from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccountActiveGuard } from './guards/account-active.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';

// ─── Helper to extract IP and device info from request ────────────────────────

function extractIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return first.split(',')[0].trim();
  }
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

function extractDeviceInfo(req: Request): {
  ipAddress: string;
  userAgent: string;
} {
  return {
    ipAddress: extractIp(req),
    userAgent: (req.headers['user-agent'] as string) ?? 'unknown',
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── Registration ──────────────────────────────────────────────────────────

  @Public()
  @Post('register/email')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new account with email and password' })
  @ApiResponse({ status: 201, description: 'Registration initiated; OTP sent' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async registerEmail(
    @Body() dto: RegisterEmailDto,
    @Req() req: Request,
  ) {
    return this.authService.registerEmail(dto, extractIp(req));
  }

  @Public()
  @Post('register/phone')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new account with phone number' })
  @ApiResponse({ status: 201, description: 'Registration initiated; OTP sent' })
  @ApiResponse({ status: 409, description: 'Phone already in use' })
  async registerPhone(
    @Body() dto: RegisterPhoneDto,
    @Req() req: Request,
  ) {
    return this.authService.registerPhone(dto, extractIp(req));
  }

  // ─── OTP ──────────────────────────────────────────────────────────────────

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a one-time password to activate account' })
  @ApiResponse({ status: 200, description: 'OTP verified; tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
  ) {
    return this.authService.verifyOtp(dto, extractDeviceInfo(req));
  }

  @Public()
  @Post('otp/resend')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Resend a verification OTP (max 3 per minute)' })
  @ApiResponse({ status: 200, description: 'OTP resent' })
  @ApiResponse({ status: 400, description: 'Cooldown active or already verified' })
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email/phone and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account suspended' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ) {
    return this.authService.login(dto, extractDeviceInfo(req));
  }

  // ─── Token refresh ────────────────────────────────────────────────────────

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a refresh token for a new token pair' })
  @ApiResponse({ status: 200, description: 'New tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the current refresh token' })
  @ApiResponse({ status: 204, description: 'Logged out' })
  async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.logout(dto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke all refresh tokens for the current user' })
  @ApiResponse({ status: 204, description: 'All sessions invalidated' })
  async logoutAll(@CurrentUser() user: JwtPayload) {
    await this.authService.logoutAll(user.sub);
  }

  // ─── Password reset ───────────────────────────────────────────────────────

  @Public()
  @Post('password/reset-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('password/reset-confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset with token and new password' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async confirmPasswordReset(@Body() dto: ConfirmPasswordResetDto) {
    return this.authService.confirmPasswordReset(dto.token, dto.newPassword);
  }

  // ─── Account management ───────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AccountActiveGuard)
  @Delete('account')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Schedule account deletion (soft-delete, 30-day grace)' })
  @ApiResponse({ status: 204, description: 'Account deletion scheduled' })
  async deleteAccount(@CurrentUser() user: JwtPayload) {
    await this.authService.deleteAccount(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('account/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Temporarily deactivate account' })
  @ApiResponse({ status: 204, description: 'Account deactivated' })
  async deactivateAccount(@CurrentUser() user: JwtPayload) {
    await this.authService.deactivateAccount(user.sub);
  }
}
