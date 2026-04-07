import { isAxiosError } from 'axios';

export function parseApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.detail === 'string') return data.detail;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
