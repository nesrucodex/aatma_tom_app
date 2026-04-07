import '../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Toaster } from '../components';
import { queryClient } from '../lib/query-client';
import { useAuthStore } from '../store/auth.store';
import { debug } from '@/lib/debug';

function AuthGate() {
  const { isAuthenticated, isLoading, loadAuth, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  debug.log("AuthGate", {isAuthenticated, user})

  useEffect(() => { loadAuth(); }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) router.replace('/(auth)/sign-in');
    else if (isAuthenticated && inAuth) router.replace('/(tabs)');
  }, [isAuthenticated, isLoading, segments]);

  if(isLoading) return null

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}> 
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <AuthGate />
            <Toaster />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
