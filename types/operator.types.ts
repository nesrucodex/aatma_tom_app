import { z } from 'zod';

const operationItemSchema = z.object({
  id: z.string(),
  type: z.enum(['CHECK_IN', 'CHECK_OUT']),
  checkInAt: z.string(),
  checkOutAt: z.string().nullable(),
  waitingTimeMinutes: z.number().nullable(),
  terminalId: z.string(),
  vehicleId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

const salaryPaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  periodStart: z.string(),
  periodEnd: z.string(),
  createdAt: z.string(),
}).passthrough();

export const operatorMemberDetailSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    terminalOperator: z.object({
      userId: z.string(),
      status: z.string(),
      bankName: z.string(),
      bankAccountNumber: z.string(),
      associationId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string().nullable(),
        phone: z.string().nullable(),
        role: z.string(),
        isActive: z.boolean(),
        createdAt: z.string(),
      }).passthrough(),
      association: z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
      }).passthrough(),
      checkInTerminalOperations: z.array(operationItemSchema),
      checkOutTerminalOperations: z.array(operationItemSchema),
    }).passthrough(),
    receivedSalary: z.number(),
    pendingPayment: z.number(),
    totalEarning: z.number(),
    operatorSalaryTransactions: z.array(salaryPaymentSchema),
  }),
});

export type OperatorMemberDetail = z.infer<typeof operatorMemberDetailSchema>['data'];
