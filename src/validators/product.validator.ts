import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  shortDescription: z.string().max(200).optional(),
  thumbnail: z.string().url().or(z.string().emoji()),
  price: z.number().min(0).max(100000),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10),
  features: z.array(z.string()).max(20).optional(),
  techStack: z.array(z.string()).max(15).optional(),
  previewUrl: z.string().url().optional().or(z.literal('')),
  demoVideoUrl: z.string().url().optional().or(z.literal('')),
  sourceRepoUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
  productId: z.string().cuid(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
