import { z } from 'zod';

export const createPurchaseSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
});

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

export const purchaseQuerySchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  limit: z.number().min(1).max(100).default(50).optional(),
  offset: z.number().min(0).default(0).optional(),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type PurchaseQueryInput = z.infer<typeof purchaseQuerySchema>;
