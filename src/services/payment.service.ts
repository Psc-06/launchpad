import { prisma } from '@/lib/db';
import Stripe from 'stripe';
import { getEnv } from '@/config/env';
import { logger } from '@/utils/logger';
import { generateLicenseKey } from '@/lib/utils';

const env = getEnv();
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee

export interface CreateCheckoutSessionParams {
  productId: string;
  userId: string;
  userEmail: string;
}

export interface PurchaseResult {
  purchase: any;
  checkoutUrl?: string;
}

export class PaymentService {
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<PurchaseResult> {
    const { productId, userId, userEmail } = params;

    try {
      // Get product
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { seller: true },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if already purchased
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          productId,
          buyerId: userId,
          status: 'COMPLETED',
        },
      });

      if (existingPurchase) {
        throw new Error('You already own this product');
      }

      // Calculate amounts
      const productAmount = Math.round(product.price * 100); // Convert to cents
      const platformFee = Math.round(productAmount * PLATFORM_FEE_PERCENTAGE);

      // Create pending purchase
      const purchase = await prisma.purchase.create({
        data: {
          productId,
          buyerId: userId,
          sellerId: product.sellerId,
          amount: product.price,
          currency: 'USD',
          status: 'PENDING',
        },
      });

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.title,
                description: product.shortDescription || undefined,
                images: product.thumbnail ? [product.thumbnail] : undefined,
              },
              unit_amount: productAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/buyer?success=true&purchase_id=${purchase.id}`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/products?canceled=true`,
        customer_email: userEmail,
        client_reference_id: purchase.id,
        metadata: {
          purchaseId: purchase.id,
          productId,
          userId,
          sellerId: product.sellerId,
        },
        // Note: Stripe Connect setup required for seller payouts
        // Uncomment when sellers have connected Stripe accounts
        // payment_intent_data: {
        //   application_fee_amount: platformFee,
        //   transfer_data: {
        //     destination: product.seller.stripeAccountId,
        //   },
        // },
      });

      // Update purchase with stripe session ID
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { stripePaymentId: session.id },
      });

      logger.payment('created', userId, {
        purchaseId: purchase.id,
        productId,
        amount: product.price,
        sessionId: session.id,
      });

      return {
        purchase,
        checkoutUrl: session.url || undefined,
      };
    } catch (error) {
      logger.error('Failed to create checkout session', error, { productId, userId });
      throw error;
    }
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        
        case 'payment_intent.succeeded':
          logger.payment('completed', event.data.object.metadata?.userId || 'unknown', {
            paymentIntentId: event.data.object.id,
          });
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        
        default:
          logger.debug(`Unhandled webhook event: ${event.type}`);
      }
    } catch (error) {
      logger.error('Webhook handler failed', error, { eventType: event.type });
      throw error;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const purchaseId = session.client_reference_id || session.metadata?.purchaseId;

    if (!purchaseId) {
      throw new Error('Purchase ID not found in session');
    }

    // Update purchase status
    const purchase = await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: 'COMPLETED',
        stripePaymentId: session.payment_intent as string,
      },
      include: { product: true },
    });

    // Generate and activate license key
    await prisma.licenseKey.create({
      data: {
        key: generateLicenseKey(),
        productId: purchase.productId,
        userId: purchase.buyerId,
        purchaseId: purchase.id,
        status: 'ACTIVE',
      },
    });

    // Update product download count
    await prisma.product.update({
      where: { id: purchase.productId },
      data: { downloads: { increment: 1 } },
    });

    logger.payment('completed', purchase.buyerId, {
      purchaseId: purchase.id,
      productId: purchase.productId,
      amount: purchase.amount,
    });
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const purchaseId = paymentIntent.metadata?.purchaseId;

    if (purchaseId) {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: 'FAILED' },
      });

      logger.payment('failed', paymentIntent.metadata?.userId || 'unknown', {
        purchaseId,
        reason: paymentIntent.last_payment_error?.message,
      });
    }
  }

  async refundPurchase(purchaseId: string, userId: string): Promise<void> {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { licenseKey: true },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    if (purchase.buyerId !== userId) {
      throw new Error('Unauthorized');
    }

    if (purchase.status !== 'COMPLETED') {
      throw new Error('Purchase cannot be refunded');
    }

    // Create Stripe refund
    if (purchase.stripePaymentId) {
      await stripe.refunds.create({
        payment_intent: purchase.stripePaymentId,
      });
    }

    // Update purchase and license
    await prisma.$transaction([
      prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: 'REFUNDED' },
      }),
      ...(purchase.licenseKey ? [
        prisma.licenseKey.update({
          where: { id: purchase.licenseKey.id },
          data: { status: 'REVOKED' },
        }),
      ] : []),
    ]);

    logger.payment('refunded', userId, { purchaseId });
  }
}

export const paymentService = new PaymentService();
