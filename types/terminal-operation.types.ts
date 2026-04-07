import { z } from 'zod';

export const terminalSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
}).passthrough();

export const vehicleSchema = z.object({
  id: z.string(),
  licensePlate: z.string(),
  model: z.string().nullable(),
  manufacturer: z.string().nullable(),
  status: z.string(),
  type: z.string(),
}).passthrough();

export const terminalOperationSchema = z.object({
  id: z.string(),
  type: z.enum(['CHECK_IN', 'CHECK_OUT']),
  waitingTimeMinutes: z.number().nullable(),
  checkInAt: z.string(),
  checkOutAt: z.string().nullable(),
  terminalId: z.string(),
  vehicleId: z.string(),
  checkInTerminalOperatorId: z.string(),
  checkOutTerminalOperatorId: z.string().nullable(),
  transactionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  terminal: terminalSchema,
  vehicle: vehicleSchema,
  checkInTerminalOperator: z.object({
    userId: z.string(),
    status: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      phone: z.string().nullable(),
    }).passthrough().optional(),
  }).passthrough(),
  checkOutTerminalOperator: z.object({
    userId: z.string(),
    status: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      phone: z.string().nullable(),
    }).passthrough().optional(),
  }).passthrough().nullable(),
  transaction: z.unknown().nullable(),
});

export const terminalOperationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    operations: z.array(terminalOperationSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
    }),
  }),
});

export type TerminalOperation = z.infer<typeof terminalOperationSchema>;
export type TerminalOperationsResponse = z.infer<typeof terminalOperationsResponseSchema>;
