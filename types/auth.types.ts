import { z } from 'zod';

// Nested relations
const terminalOperatorSchema = z.object({
  status: z.string(),
  bankName: z.string(),
  bankAccountNumber: z.string(),
  userId: z.string(),
  associationId: z.string(),
}).nullable();

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  password: z.string().nullable(),
  role: z.string(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  deletedAt: z.string().nullable(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  terminalOperator: terminalOperatorSchema.optional(),
  trafficPolice: z.unknown().nullable().optional(),
  transportAuthority: z.unknown().nullable().optional(),
});

export const tokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  accessTokenExpiresAt: z.string(),
  refreshTokenExpiresAt: z.string(),
});

// POST /auth/login/phone
export const requestOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  statusCode: z.number().optional(),
  timestamp: z.string().optional(),
  data: z.object({
    user: userSchema,
    retryAfter: z.number(),
    expiry: z.number(),
  }),
  otp: z.string().optional(),
});

// POST /auth/verify/otp
export const verifyOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  statusCode: z.number().optional(),
  timestamp: z.string().optional(),
  data: z.object({
    user: userSchema,
    tokens: tokenSchema,
  }),
});

export type User = z.infer<typeof userSchema>;
export type Tokens = z.infer<typeof tokenSchema>;
export type RequestOtpResponse = z.infer<typeof requestOtpResponseSchema>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
