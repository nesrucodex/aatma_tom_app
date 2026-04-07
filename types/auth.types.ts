import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  role: z.string(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const tokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  accessTokenExpiresAt: z.string(),
  refreshTokenExpiresAt: z.string(),
});

// POST /auth/login/phone  → { data: { user, retryAfter, expiry }, otp? }
export const requestOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userSchema,
    retryAfter: z.number(),
    expiry: z.number(),
  }),
  otp: z.string().optional(), // only present in dev
});

// POST /auth/verify/otp  → { data: { user, tokens } }
export const verifyOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userSchema,
    tokens: tokenSchema,
  }),
});

export type User = z.infer<typeof userSchema>;
export type RequestOtpResponse = z.infer<typeof requestOtpResponseSchema>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
