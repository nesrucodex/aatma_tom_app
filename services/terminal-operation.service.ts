import { z } from 'zod';

import { apiClient } from '../lib/axios';
import {
  terminalOperationsResponseSchema,
  type TerminalOperationsResponse,
} from '../types/terminal-operation.types';

const checkInResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    operation: z.object({
      id: z.string(),
      type: z.string(),
      checkInAt: z.string(),
      vehicleId: z.string(),
      terminalId: z.string(),
    }).passthrough(),
    transaction: z.object({
      id: z.string(),
      amount: z.number(),
      type: z.string(),
    }).optional(),
  }),
});

interface GetOperationsParams {
  terminalId?: string;
  type?: 'CHECK_IN' | 'CHECK_OUT';
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export const terminalOperationService = {
  checkIn: async (vehicleId: string) => {
    const res = await apiClient.post('/terminal-operations/check-in', { vehicleId });
    return checkInResponseSchema.parse(res.data);
  },

  resolveConflict: async (vehicleId: string, phoneNumber: string) => {
    const res = await apiClient.post('/terminal-operations/resolve-conflict', { vehicleId, phoneNumber });
    return res.data as {
      data: {
        transaction: { id: string; amount: number; status: string };
        operationId: string;
      };
    };
  },

  getTransactionStatus: async (transactionId: string): Promise<string | undefined> => {
    const res = await apiClient.get(`/transactions/${transactionId}`);
    return res.data?.data?.transaction?.status as string | undefined;
  },

  getOperations: async (params: GetOperationsParams = {}): Promise<TerminalOperationsResponse> => {
    const res = await apiClient.get('/terminal-operations', { params });
    const parsed = terminalOperationsResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      console.warn('[terminalOperationService] parse error:', parsed.error.issues.slice(0, 3));
      return res.data as TerminalOperationsResponse;
    }
    return parsed.data;
  },
};
