import { useState, useCallback } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  variant: ToastVariant;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    variant: 'info',
  });

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    setToast({ visible: true, message, variant });
  }, []);

  const hide = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, show, hide };
}
