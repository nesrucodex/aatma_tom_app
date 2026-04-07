import { z } from 'zod';

export const userDetailSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  role: z.string(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  terminalOperator: z.object({
    userId: z.string(),
    status: z.string(),
    bankName: z.string(),
    bankAccountNumber: z.string(),
    associationId: z.string(),
    association: z.object({
      id: z.string(),
      name: z.string(),
      status: z.string(),
      terminalId: z.string().nullable(),
      terminal: z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        description: z.string().nullable(),
      }).nullable(),
    }).nullable(),
  }).nullable(),
}).loose();

export const userDetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({ user: userDetailSchema }),
});

export type UserDetail = z.infer<typeof userDetailSchema>;
