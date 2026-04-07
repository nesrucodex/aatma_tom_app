import { apiClient } from '../lib/axios';
import { operatorMemberDetailSchema, type OperatorMemberDetail } from '../types/operator.types';

export const operatorService = {
  getMemberDetail: async (userId: string): Promise<OperatorMemberDetail> => {
    const res = await apiClient.get(`/associations/members/${userId}`);
    return operatorMemberDetailSchema.parse(res.data).data;
  },
};
