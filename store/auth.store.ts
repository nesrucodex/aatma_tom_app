import { create } from 'zustand';

import { tokenStorage } from '../lib/token-storage';
import { type Tokens, type User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (tokens: Tokens, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (tokens, user) => {
    await Promise.all([
      tokenStorage.set(tokens.accessToken),
      tokenStorage.setRefresh(tokens.refreshToken),
      tokenStorage.setUser(user),
    ]);
    set({ tokens, user, isAuthenticated: true });
  },

  clearAuth: async () => {
    await tokenStorage.clearAll();
    set({ tokens: null, user: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    const [accessToken, refreshToken, userJson] = await Promise.all([
      tokenStorage.get(),
      tokenStorage.getRefresh(),
      tokenStorage.getUser(),
    ]);

    if (accessToken && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        set({
          tokens: {
            accessToken,
            refreshToken: refreshToken ?? '',
            tokenType: 'Bearer',
            accessTokenExpiresAt: '',
            refreshTokenExpiresAt: '',
          },
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch {
        await tokenStorage.clearAll();
      }
    }

    set({ isAuthenticated: false, isLoading: false });
  },
}));
