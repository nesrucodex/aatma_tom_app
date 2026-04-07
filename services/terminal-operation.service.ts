import { apiClient } from '../lib/axios';
import {
  terminalOperationsResponseSchema,
  type TerminalOperationsResponse,
} from '../types/terminal-operation.types';

interface GetOperationsParams {
  terminalId?: string;
  type?: 'CHECK_IN' | 'CHECK_OUT';
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export const terminalOperationService = {
  getOperations: async (params: GetOperationsParams = {}): Promise<TerminalOperationsResponse> => {
    const res = await apiClient.get('/terminal-operations', { params });
    return terminalOperationsResponseSchema.parse(res.data);
  },
};
