import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function useRequestOtp() {
  return useMutation({
    mutationFn: (phoneNumber: string) => authService.requestOtp(phoneNumber),
  });
}

export function useVerifyOtp() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      authService.verifyOtp(phoneNumber, otp),
    onSuccess: async (res) => {
      await setAuth(res.data.tokens, res.data.user);
      router.replace('/(tabs)');
    },
  });
}

export function useSignOut() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return async () => {
    await clearAuth();
    router.replace('/(auth)/sign-in');
  };
}
