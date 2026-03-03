import { z, ZodError } from 'zod';
import { validationErrorResponse } from './api-response';

export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string[]> = {};
      
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });

      throw new ValidationError(formattedErrors);
    }
    throw error;
  }
}

export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export function handleValidationError(error: unknown) {
  if (error instanceof ValidationError) {
    return validationErrorResponse(error.errors);
  }
  throw error;
}
