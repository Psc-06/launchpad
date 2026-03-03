import { z } from 'zod';

export const aiScopeRequestSchema = z.object({
  idea: z.string()
    .min(10, 'Project idea must be at least 10 characters')
    .max(2000, 'Project idea is too long'),
  targetAudience: z.string().max(500).optional(),
  budget: z.number().min(0).max(1000000).optional(),
  timeline: z.string().max(100).optional(),
});

export const aiGeneratorRequestSchema = z.object({
  prompt: z.string().min(5).max(1000),
  type: z.enum(['idea', 'description', 'features', 'landing_page']),
  context: z.string().max(2000).optional(),
});

export type AIScopeRequestInput = z.infer<typeof aiScopeRequestSchema>;
export type AIGeneratorRequestInput = z.infer<typeof aiGeneratorRequestSchema>;
