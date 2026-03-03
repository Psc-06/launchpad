import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { rateLimiters } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { validateSchema, handleValidationError } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { aiScopeRequestSchema } from '@/validators/ai.validator';

export async function POST(request: NextRequest) {
  try {
    // Strict rate limiting for AI endpoints
    const rateLimitResult = await rateLimiters.strict(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication required
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const session = authResult;

    // Check usage limits
    const canUse = await aiService.checkUsageLimit(session.user.id);
    if (!canUse) {
      return errorResponse('AI usage limit exceeded. Please upgrade your plan.', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateSchema(aiScopeRequestSchema, body);

    // Generate AI scope
    const result = await aiService.generateProjectScope(validatedData, session.user.id);

    return successResponse(result);

  } catch (error) {
    return handleValidationError(error);
  }
}
