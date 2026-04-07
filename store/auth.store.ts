import { create } from 'zustand';

import { tokenStorage } from '../lib/token-storage';
import { type User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, user) => {
    await tokenStorage.set(token);
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: async () => {
    await tokenStorage.remove();
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadToken: async () => {
    const token = await tokenStorage.get();
    set({ token, isAuthenticated: !!token, isLoading: false });
  },
}));
