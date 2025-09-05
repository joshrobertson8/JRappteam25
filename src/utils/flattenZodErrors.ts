import { z } from 'zod';

interface FlatError {
  field: string;
  message: string;
}

export function flattenZodErrors(error: z.ZodError): FlatError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
