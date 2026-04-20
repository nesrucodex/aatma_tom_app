import { apiClient } from '../lib/axios';
import type { TerminalOperation, TerminalOperationsResponse } from '../types/terminal-operation.types';
import type { TerminalOperationType } from '../types/terminal-operation.types';

export type CheckInOperation = {
  id: string;
  type: string;
  checkInAt: string;
  vehicleId: string;
  terminalId: string;
};

export type CheckInTransaction = {
  id: string;
  amount: number;
  type: string;
};

export type CheckInResponse = {
  success: boolean;
  message: string;
  data: {
    operation: CheckInOperation;
    transaction?: CheckInTransaction;
  };
};

export type ResolveConflictResponse = {
  data: {
    transaction: { id: string; amount: number; status: string };
    operationId: string;
  };
};

export type GetOperationsParams = {
  terminalId?: string;
  type?: TerminalOperationType;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
};

export const terminalOperationService = {
  checkIn: async (vehicleId: string): Promise<CheckInResponse> => {
    const res = await apiClient.post<CheckInResponse>('/terminal-operations/check-in', { vehicleId });
    return res.data;
  },

  resolveConflict: async (vehicleId: string, phoneNumber: string): Promise<ResolveConflictResponse> => {
    const res = await apiClient.post<ResolveConflictResponse>('/terminal-operations/resolve-conflict', { vehicleId, phoneNumber });
    return res.data;
  },

  getTransactionStatus: async (transactionId: string): Promise<string | undefined> => {
    const res = await apiClient.get<{ data: { transaction: { status: string } } }>(`/transactions/${transactionId}`);
    return res.data?.data?.transaction?.status;
  },

  getOperations: async (params: GetOperationsParams = {}): Promise<TerminalOperationsResponse> => {
    const res = await apiClient.get<TerminalOperationsResponse>('/terminal-operations', { params });
    return res.data;
  },
};
