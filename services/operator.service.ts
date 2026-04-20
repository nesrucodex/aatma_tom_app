import { apiClient } from '../lib/axios';
import type { OperatorMemberDetail, OperatorMemberDetailResponse } from '../types/operator.types';

export const operatorService = {
  getMemberDetail: async (userId: string): Promise<OperatorMemberDetail> => {
    const params = new URLSearchParams({ opsPage: "1", opsLimit: "1000" });
    const res = await apiClient.get<OperatorMemberDetailResponse>(`/associations/members/${userId}`, { params });
    return res.data.data;
  },
};
