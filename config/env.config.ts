import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url('EXPO_PUBLIC_API_URL must be a valid URL'),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
