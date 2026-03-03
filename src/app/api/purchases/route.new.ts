import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/middleware/auth';
import { rateLimiters } from '@/middleware/rateLimit';
import { paymentService } from '@/services/payment.service';
import { validateSchema, handleValidationError } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { createPurchaseSchema } from '@/validators/payment.validator';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.standard(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const session = authResult;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateSchema(createPurchaseSchema, body);

    // Create checkout session
    const result = await paymentService.createCheckoutSession({
      productId: validatedData.productId,
      userId: session.user.id,
      userEmail: session.user.email!,
    });

    return successResponse({
      purchase: result.purchase,
      checkoutUrl: result.checkoutUrl,
      message: 'Checkout session created. Redirecting to payment...',
    }, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    logger.error('Failed to create purchase', error);
    
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to create purchase', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.standard(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const session = authResult;

    // Get purchases
    const { prisma } = await import('@/lib/db');
    const purchases = await prisma.purchase.findMany({
      where: {
        buyerId: session.user.id,
      },
      include: {
        product: {
          select: {
            title: true,
            slug: true,
            thumbnail: true,
            price: true,
            sourceRepoUrl: true,
            previewUrl: true,
            description: true,
          },
        },
        licenseKey: {
          select: {
            id: true,
            key: true,
            status: true,
            activationCount: true,
            maxActivations: true,
            expiresAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(purchases);

  } catch (error) {
    logger.error('Failed to fetch purchases', error);
    return errorResponse('Failed to fetch purchases', 500);
  }
}
