import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { paymentService } from '@/services/payment.service';
import { successResponse, errorResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { getEnv } from '@/config/env';

const env = getEnv();
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('Missing signature', 400);
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      logger.error('STRIPE_WEBHOOK_SECRET not configured');
      return errorResponse('Webhook not configured', 500);
    }

    // Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error('Webhook signature verification failed', err);
      return errorResponse('Invalid signature', 400);
    }

    // Handle the event
    logger.info(`Processing webhook: ${event.type}`, {
      eventId: event.id,
      type: event.type,
    });

    await paymentService.handleWebhook(event);

    return successResponse({ received: true });

  } catch (error) {
    logger.error('Webhook handler failed', error);
    return errorResponse('Webhook handler failed', 500);
  }
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
