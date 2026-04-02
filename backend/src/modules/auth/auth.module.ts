import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccountActiveGuard } from './guards/account-active.guard';

// These modules must be globally available or imported by the consuming module.
// We import them here so AuthModule is self-contained.
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * Register JwtModule asynchronously so we can pull the access secret from
     * ConfigService. The module is also exported so other modules can use
     * JwtService for token verification without re-importing everything.
     *
     * Note: individual sign() calls in TokenService explicitly pass the
     * secret and expiry so these defaults are a safety net only.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRY') ?? '15m',
        },
      }),
    }),

    PrismaModule,
    RedisModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    OtpService,
    TokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    // Make guards available for injection by other modules if needed
    JwtAuthGuard,
    AccountActiveGuard,
  ],

  exports: [
    AuthService,
    TokenService,
    // Export JwtModule so consumers can inject JwtService for token verification
    JwtModule,
    // Export guards so other modules can apply them without re-providing
    JwtAuthGuard,
    AccountActiveGuard,
  ],
})
export class AuthModule {}
