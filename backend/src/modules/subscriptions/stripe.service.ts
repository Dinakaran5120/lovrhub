import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '@/prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';

const TIER_PRICE_CONFIG_KEYS: Record<string, string> = {
  premium: 'STRIPE_PRICE_ID_PREMIUM',
  premium_plus: 'STRIPE_PRICE_ID_PREMIUM_PLUS',
};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.config.getOrThrow<string>('STRIPE_SECRET_KEY');
    this.webhookSecret = this.config.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-06-20',
    });
  }

  async getOrCreateStripeCustomer(
    userId: string,
    email: string,
  ): Promise<string> {
    // Try to find existing stripe customer ID stored in user meta
    const userMeta = await this.prisma.userMeta.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (userMeta?.stripeCustomerId) {
      return userMeta.stripeCustomerId;
    }

    // Create a new Stripe customer
    const customer = await this.stripe.customers.create({
      email,
      metadata: { userId },
    });

    // Upsert the stripeCustomerId into user meta
    await this.prisma.userMeta.upsert({
      where: { userId },
      create: { userId, stripeCustomerId: customer.id },
      update: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  async createCheckoutSession(
    userId: string,
    tier: SubscriptionTier,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const configKey = TIER_PRICE_CONFIG_KEYS[tier];
    if (!configKey) {
      throw new BadRequestException(`No price configured for tier: ${tier}`);
    }

    const priceId = this.config.getOrThrow<string>(configKey);
    const customerId = await this.getOrCreateStripeCustomer(userId, user.email);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
      subscription_data: {
        metadata: { userId, tier },
      },
      allow_promotion_codes: true,
    });

    return session;
  }

  async createBillingPortalSession(
    userId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    const userMeta = await this.prisma.userMeta.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (!userMeta?.stripeCustomerId) {
      throw new BadRequestException(
        'No billing information found for this user',
      );
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: userMeta.stripeCustomerId,
      return_url: returnUrl,
    });

    return session;
  }

  async cancelSubscription(
    stripeSubscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async handleWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice,
        );
        break;

      default:
        this.logger.debug(`Unhandled Stripe event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) {
      this.logger.error(
        `checkout.session.completed missing userId in metadata`,
      );
      return;
    }

    if (session.mode !== 'subscription' || !session.subscription) {
      return;
    }

    const stripeSubId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription.id;

    const sub = await this.stripe.subscriptions.retrieve(stripeSubId);
    const tierMeta = (sub.metadata?.tier as SubscriptionTier) ?? SubscriptionTier.premium;

    await this.upsertSubscription(userId, sub, tierMeta, 'active');
  }

  private async handleSubscriptionUpdated(
    sub: Stripe.Subscription,
  ): Promise<void> {
    const userId = sub.metadata?.userId;
    if (!userId) {
      this.logger.warn(
        `subscription.updated: no userId in metadata for sub ${sub.id}`,
      );
      return;
    }

    const tier = (sub.metadata?.tier as SubscriptionTier) ?? SubscriptionTier.premium;
    const status = this.mapStripeStatus(sub.status);

    await this.upsertSubscription(userId, sub, tier, status);
  }

  private async handleSubscriptionDeleted(
    sub: Stripe.Subscription,
  ): Promise<void> {
    const userId = sub.metadata?.userId;
    if (!userId) {
      this.logger.warn(
        `subscription.deleted: no userId in metadata for sub ${sub.id}`,
      );
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: { providerSubId: sub.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { subscriptionTier: SubscriptionTier.free },
      });
    });
  }

  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    const subId =
      typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id;

    if (!subId) return;

    await this.prisma.subscription.updateMany({
      where: { providerSubId: subId },
      data: { status: 'past_due' },
    });
  }

  private async upsertSubscription(
    userId: string,
    sub: Stripe.Subscription,
    tier: SubscriptionTier,
    status: string,
  ): Promise<void> {
    const periodStart = new Date(sub.current_period_start * 1000);
    const periodEnd = new Date(sub.current_period_end * 1000);

    await this.prisma.$transaction(async (tx) => {
      await tx.subscription.upsert({
        where: { providerSubId: sub.id },
        create: {
          userId,
          tier,
          paymentProvider: 'stripe',
          providerSubId: sub.id,
          status,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
        update: {
          status,
          tier,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          cancelledAt: sub.cancel_at_period_end ? new Date(sub.cancel_at * 1000) : null,
        },
      });

      if (status === 'active') {
        await tx.user.update({
          where: { id: userId },
          data: { subscriptionTier: tier },
        });
      }
    });
  }

  private mapStripeStatus(stripeStatus: Stripe.Subscription.Status): string {
    const statusMap: Record<Stripe.Subscription.Status, string> = {
      active: 'active',
      canceled: 'cancelled',
      incomplete: 'incomplete',
      incomplete_expired: 'expired',
      past_due: 'past_due',
      paused: 'paused',
      trialing: 'active',
      unpaid: 'past_due',
    };

    return statusMap[stripeStatus] ?? 'unknown';
  }
}
