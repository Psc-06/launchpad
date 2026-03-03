import { NextRequest, NextResponse } from 'next/server';
import { rateLimitResponse } from '@/utils/api-response';

interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export function rateLimit(config: RateLimitConfig) {
  const { interval, maxRequests } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get identifier (IP or user ID)
    const identifier = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const key = `${identifier}:${request.nextUrl.pathname}`;
    const now = Date.now();

    // Initialize or get current rate limit data
    if (!store[key] || store[key].resetAt < now) {
      store[key] = {
        count: 1,
        resetAt: now + interval,
      };
      return null; // Allow request
    }

    // Increment counter
    store[key].count++;

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      const retryAfter = Math.ceil((store[key].resetAt - now) / 1000);
      
      const response = rateLimitResponse(
        `Too many requests. Please try again in ${retryAfter} seconds.`
      );
      
      response.headers.set('X-RateLimit-Limit', maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', store[key].resetAt.toString());
      response.headers.set('Retry-After', retryAfter.toString());
      
      return response;
    }

    return null; // Allow request
  };
}

// Preset configurations
export const rateLimiters = {
  // Strict: AI endpoints, expensive operations
  strict: rateLimit({
    interval: 60 * 1000, // 1 minute
    maxRequests: 5,
  }),
  
  // Standard: API endpoints
  standard: rateLimit({
    interval: 60 * 1000, // 1 minute
    maxRequests: 30,
  }),
  
  // Lenient: Public endpoints
  lenient: rateLimit({
    interval: 60 * 1000, // 1 minute
    maxRequests: 100,
  }),
  
  // Auth: Login/Register
  auth: rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  }),
};
