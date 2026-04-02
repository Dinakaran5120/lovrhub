import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsString, IsUrl } from 'class-validator';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionTier } from '@prisma/client';

class CreateCheckoutDto {
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;

  @IsString()
  successUrl: string;

  @IsString()
  cancelUrl: string;
}

class BillingPortalDto {
  @IsString()
  returnUrl: string;
}

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getCurrentSubscription(userId);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.subscriptionsService.createCheckoutSession(userId, dto.tier, {
      success: dto.successUrl,
      cancel: dto.cancelUrl,
    });
  }

  @Post('billing-portal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createBillingPortal(
    @CurrentUser('id') userId: string,
    @Body() dto: BillingPortalDto,
  ) {
    return this.subscriptionsService.createBillingPortal(
      userId,
      dto.returnUrl,
    );
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancelSubscription(userId);
  }

  /**
   * Stripe Webhook endpoint - must receive raw body.
   * In main.ts, configure raw body for this route:
   * app.use('/subscriptions/webhook', express.raw({ type: 'application/json' }));
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    // req.body is Buffer when raw body middleware is applied
    const rawBody: Buffer = req.body as unknown as Buffer;

    return this.subscriptionsService.handleStripeWebhook(rawBody, signature);
  }
}
