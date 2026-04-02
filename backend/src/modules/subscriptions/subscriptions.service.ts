import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StripeService } from './stripe.service';
import { SubscriptionTier } from '@prisma/client';

interface CheckoutUrls {
  success: string;
  cancel: string;
}

interface Plan {
  tier: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  getPlans(): { plans: Plan[] } {
    return {
      plans: [
        {
          tier: 'premium',
          name: 'Premium',
          price: 9.99,
          interval: 'month',
          features: [
            'See who liked you',
            'Unlimited swipes',
            'Advanced filters',
            'Priority in discover',
            'Read receipts',
          ],
        },
        {
          tier: 'premium_plus',
          name: 'Premium+',
          price: 19.99,
          interval: 'month',
          features: [
            'All Premium features',
            'Boost profile 5x per week',
            'Incognito mode',
            'Rewind last swipe',
            'See all who liked you at once',
            'Dedicated support',
          ],
        },
      ],
    };
  }

  async getCurrentSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'past_due', 'paused'] },
      },
      orderBy: { currentPeriodEnd: 'desc' },
    });

    if (!subscription) {
      return {
        subscription: null,
        tier: SubscriptionTier.free,
        message: 'No active subscription. Currently on free tier.',
      };
    }

    return { subscription };
  }

  async createCheckoutSession(
    userId: string,
    tier: SubscriptionTier,
    urls: CheckoutUrls,
  ) {
    if (tier === SubscriptionTier.free) {
      throw new BadRequestException(
        'Cannot create a checkout session for the free tier',
      );
    }

    const session = await this.stripeService.createCheckoutSession(
      userId,
      tier,
      urls.success,
      urls.cancel,
    );

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async createBillingPortal(userId: string, returnUrl: string) {
    const session = await this.stripeService.createBillingPortalSession(
      userId,
      returnUrl,
    );

    return { url: session.url };
  }

  async handleStripeWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    return this.stripeService.handleWebhook(rawBody, signature);
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: { currentPeriodEnd: 'desc' },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    if (!subscription.providerSubId) {
      throw new BadRequestException(
        'Subscription has no provider reference to cancel',
      );
    }

    await this.stripeService.cancelSubscription(subscription.providerSubId);

    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelledAt: new Date(),
      },
    });

    return {
      message:
        'Subscription will be cancelled at the end of the current billing period',
      subscription: updated,
    };
  }
}
