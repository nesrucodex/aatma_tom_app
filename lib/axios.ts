import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '../config/env.config';
import { tokenStorage } from './token-storage';

export const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach token + log outgoing
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    console.log(
      `\n📤 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      ...(config.params ? ['\n  params:', config.params] : []),
      ...(config.data ? ['\n  body:', config.data] : []),
    );
  }

  return config;
});

// Response interceptor — log incoming + handle 401
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(
        `\n📥 [API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        '\n  data:', response.data,
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.warn(
        `\n❌ [API] ${error.response?.status ?? 'ERR'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        '\n  error:', error.response?.data ?? error.message,
      );
    }

    if (error.response?.status === 401) {
      await tokenStorage.clearAll();
    }

    return Promise.reject(error);
  },
);
