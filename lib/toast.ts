import { create } from 'zustand';

// Global config — change position and defaults here
export const TOASTER_CONFIG = {
  position: 'top' as 'top' | 'bottom',
  offsetTop: 52,
  offsetBottom: 32,
  duration: {
    success: 3000,
    error:   5000,
    warning: 4000,
    info:    3000,
  },
  animation: {
    outDuration: 300,
  },
} as const;

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  add: (item: Omit<ToastItem, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (item) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...item, id: Math.random().toString(36).slice(2) },
      ],
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Sonner-style API — call from anywhere, no hook needed
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, variant: 'success', duration }),

  error: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, variant: 'error', duration }),

  warning: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, variant: 'warning', duration }),

  info: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, variant: 'info', duration }),

  show: (message: string, variant: ToastVariant = 'info', duration?: number) =>
    useToastStore.getState().add({ message, variant, duration }),
};
