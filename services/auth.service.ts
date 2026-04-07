import { apiClient } from '../lib/axios';
import {
  requestOtpResponseSchema,
  verifyOtpResponseSchema,
  type RequestOtpResponse,
  type VerifyOtpResponse,
} from '../types/auth.types';

export const authService = {
  // POST /auth/login/phone  — body: { phoneNumber }
  requestOtp: async (phoneNumber: string): Promise<RequestOtpResponse> => {
    const res = await apiClient.post('/auth/login/phone', { phoneNumber });
    return requestOtpResponseSchema.parse(res.data);
  },

  // POST /auth/verify/otp  — body: { phoneNumber, otp }
  verifyOtp: async (phoneNumber: string, otp: string): Promise<VerifyOtpResponse> => {
    const res = await apiClient.post('/auth/verify/otp', { phoneNumber, otp });
    return verifyOtpResponseSchema.parse(res.data);
  },
};
