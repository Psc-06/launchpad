import { getEnv } from '@/config/env';
import { logger } from '@/utils/logger';
import { prisma } from '@/lib/db';

const env = getEnv();

export interface AIScopeInput {
  idea: string;
  targetAudience?: string;
  budget?: number;
  timeline?: string;
}

export interface AIScopeResult {
  analysis: string;
  features: string[];
  techStack: string[];
  estimatedCost: string;
  estimatedTime: string;
  marketViability: number;
  recommendations: string[];
}

export class AIService {
  private apiKey = env.OPENAI_API_KEY;
  private baseUrl = 'https://api.openai.com/v1';

  async generateProjectScope(input: AIScopeInput, userId: string): Promise<AIScopeResult> {
    try {
      // Track AI usage
      await this.trackUsage(userId, 'project_scope');

      const prompt = this.buildScopePrompt(input);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert SaaS product advisor. Provide detailed, actionable project scoping advice in JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from AI');
      }

      logger.ai('success', userId, { type: 'project_scope', tokens: data.usage?.total_tokens });

      // Parse AI response
      return this.parseScopeResponse(content);
    } catch (error) {
      logger.ai('failed', userId, { type: 'project_scope', error });
      throw error;
    }
  }

  async generateContent(
    type: 'idea' | 'description' | 'features' | 'landing_page',
    prompt: string,
    userId: string
  ): Promise<string> {
    try {
      await this.trackUsage(userId, type);

      const systemPrompts = {
        idea: 'You are a creative SaaS idea generator. Generate unique, viable SaaS product ideas.',
        description: 'You are a product marketing expert. Write compelling product descriptions.',
        features: 'You are a product manager. List detailed, user-focused product features.',
        landing_page: 'You are a conversion copywriter. Write persuasive landing page copy.',
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompts[type] },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      logger.ai('success', userId, { type, tokens: data.usage?.total_tokens });

      return content || '';
    } catch (error) {
      logger.ai('failed', userId, { type, error });
      throw error;
    }
  }

  private buildScopePrompt(input: AIScopeInput): string {
    return `
Analyze this SaaS project idea and provide a detailed scope in JSON format:

Project Idea: ${input.idea}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ''}
${input.budget ? `Budget: $${input.budget}` : ''}
${input.timeline ? `Timeline: ${input.timeline}` : ''}

Provide response in this exact JSON format:
{
  "analysis": "Brief analysis of the idea's viability and market fit",
  "features": ["Feature 1", "Feature 2", ...],
  "techStack": ["Technology 1", "Technology 2", ...],
  "estimatedCost": "Cost range",
  "estimatedTime": "Time estimate",
  "marketViability": 1-10 score,
  "recommendations": ["Recommendation 1", "Recommendation 2", ...]
}
    `.trim();
  }

  private parseScopeResponse(content: string): AIScopeResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid AI response format');
    } catch {
      // Fallback response if parsing fails
      return {
        analysis: content,
        features: [],
        techStack: [],
        estimatedCost: 'Unknown',
        estimatedTime: 'Unknown',
        marketViability: 5,
        recommendations: [],
      };
    }
  }

  private async trackUsage(userId: string, type: string): Promise<void> {
    try {
      // Create AI usage tracking table if needed
      // For now, just log it
      logger.info('AI usage tracked', { userId, type, timestamp: new Date() });
      
      // TODO: Store in database for usage limits
    } catch (error) {
      logger.warn('Failed to track AI usage', { userId, type, error });
    }
  }

  async checkUsageLimit(userId: string): Promise<boolean> {
    // TODO: Implement usage limits based on user plan
    // For now, allow unlimited usage
    return true;
  }
}

export const aiService = new AIService();
