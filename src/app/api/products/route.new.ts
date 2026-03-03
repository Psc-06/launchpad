import { NextRequest } from 'next/server';
import { requireSeller } from '@/middleware/auth';
import { rateLimiters } from '@/middleware/rateLimit';
import { productService } from '@/services/product.service';
import { validateSchema, handleValidationError } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { createProductSchema } from '@/validators/product.validator';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.standard(request);
    if (rateLimitResult) return rateLimitResult;

    // Authorization - only sellers can create products
    const authResult = await requireSeller(request);
    if (authResult instanceof Response) return authResult;
    const session = authResult;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateSchema(createProductSchema, body);

    // Create product
    const product = await productService.createProduct(validatedData, session.user.id);

    return successResponse(product, 201);

  } catch (error) {
    return handleValidationError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.lenient(request);
    if (rateLimitResult) return rateLimitResult;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    // Get products
    const products = await productService.getProducts({
      category,
      status,
      featured,
    });

    return successResponse({ products });

  } catch (error) {
    logger.error('Failed to fetch products', error);
    return errorResponse('Failed to fetch products', 500);
  }
}
