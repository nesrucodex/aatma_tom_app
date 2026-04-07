import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken:  'auth_access_token',
  refreshToken: 'auth_refresh_token',
  user:         'auth_user',
} as const;

export const tokenStorage = {
  // Access token
  get:    () => SecureStore.getItemAsync(KEYS.accessToken),
  set:    (token: string) => SecureStore.setItemAsync(KEYS.accessToken, token),
  remove: () => SecureStore.deleteItemAsync(KEYS.accessToken),

  // Refresh token
  getRefresh:    () => SecureStore.getItemAsync(KEYS.refreshToken),
  setRefresh:    (token: string) => SecureStore.setItemAsync(KEYS.refreshToken, token),
  removeRefresh: () => SecureStore.deleteItemAsync(KEYS.refreshToken),

  // User (stored as JSON string)
  getUser:    () => SecureStore.getItemAsync(KEYS.user),
  setUser:    (user: object) => SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),
  removeUser: () => SecureStore.deleteItemAsync(KEYS.user),

  // Clear all auth data at once
  clearAll: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
      SecureStore.deleteItemAsync(KEYS.user),
    ]);
  },
};
