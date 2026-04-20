import { apiClient } from '../lib/axios';
import type { RequestOtpResponse, VerifyOtpResponse } from '../types/auth.types';

export const authService = {
  requestOtp: async (phoneNumber: string): Promise<RequestOtpResponse> => {
    const res = await apiClient.post<RequestOtpResponse>('/auth/login/phone', { phoneNumber });
    return res.data;
  },

  verifyOtp: async (phoneNumber: string, otp: string): Promise<VerifyOtpResponse> => {
    const res = await apiClient.post<VerifyOtpResponse>('/auth/verify/otp', { phoneNumber, otp });
    return res.data;
  },
};
