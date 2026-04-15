import { z } from 'zod';

const envProcess = {
  // EXPO_PUBLIC_API_URL: "https://aatmabackend.etpay.et/api/v1",
  EXPO_PUBLIC_API_URL: "http://localhost:8080/api/v1",
  EXPO_PUBLIC_APP_ENV: "production"
}

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url('EXPO_PUBLIC_API_URL must be a valid URL'),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: envProcess.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_APP_ENV: envProcess.EXPO_PUBLIC_APP_ENV,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
