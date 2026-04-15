import { apiClient } from '../lib/axios';
import { operatorMemberDetailSchema, type OperatorMemberDetail } from '../types/operator.types';

export const operatorService = {
  getMemberDetail: async (userId: string): Promise<OperatorMemberDetail> => {
    const searchParams = new URLSearchParams()
    //  opsPage, opsLimit
    searchParams.set("opsPage", "1")
    searchParams.set("opsLimit", "1000")
    const res = await apiClient.get(`/associations/members/${userId}`, {
      params: searchParams
    });
    return operatorMemberDetailSchema.parse(res.data).data;
  },
};
