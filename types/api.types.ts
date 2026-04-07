import { z } from 'zod';

// Generic API response wrapper
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    success: z.boolean().optional(),
  });

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

// API error shape from backend
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
