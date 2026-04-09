import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../components';
import { useCheckIn } from '../../../hooks/useCheckIn';
import { useTerminalOperationSocket } from '../../../hooks/useTerminalOperationSocket';
import { parseApiError } from '../../../lib/api-error';
import { toast } from '../../../lib/toast';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useVehicleById } from '@/hooks/useVehicleDetail';
import { useVehicleDrivedData } from '@/hooks/useVehicleDrivedData';

type Status = 'waiting' | 'success' | 'failed';

export default function PendingScreen() {
  const router = useRouter();
  const { vehicleId, operationId, phone } =
    useLocalSearchParams<{ vehicleId: string, operationId: string, phone: string }>();

  const { data: vehicle } = useVehicleById(vehicleId)
  const { station } = useVehicleDrivedData(vehicle, [])
  const { data: userDetail } = useCurrentUser()
  const toTerminal = userDetail?.terminalOperator?.association?.terminal?.name ?? ''


  const [status, setStatus] = useState<Status>('waiting');
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const checkIn = useCheckIn();

  const { status: socketStatus, disconnect } = useTerminalOperationSocket({
    operationId,
    enabled: status === 'waiting',
    onCheckoutCompleted: () => {
      disconnect();
      setStatus('success');
    },
    onCheckoutFailed: (payload) => {
      disconnect();
      setFailedMessage(payload?.message ?? 'Payment was not completed.');
      setStatus('failed');
    },
  });

  useEffect(() => {
    if (checkIn.isSuccess) {
      toast.success('Vehicle checked in successfully');
      router.replace({
        pathname: '/(tabs)/search/resolved',
        params: {
          vehicleId,
          plate: vehicle?.licensePlate ?? vehicleId,
          fromTerminal: station,
          toTerminal,
        },
      });
    }
  }, [checkIn.isSuccess, vehicle]);

  useEffect(() => {
    if (checkIn.isError) toast.error(parseApiError(checkIn.error));
  }, [checkIn.isError]);

  const socketDot = {
    connecting: '#f59e0b',
    connected: '#16a34a',
    disconnected: '#9ca3af',
    error: '#dc2626',
  }[socketStatus];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-8 gap-6">

        {/* Waiting */}
        {status === 'waiting' && (
          <>
            <ActivityIndicator size={50} color="#1d4ed8" />
            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-neutral-900">Waiting for payment</Text>
              <Text className="text-sm text-neutral-400 text-center leading-5">
                A payment request was sent to{'\n'}
                <Text className="font-semibold text-neutral-700">+251{phone}</Text>
              </Text>
              <Text className="text-xs text-neutral-400 text-center mt-1">
                {vehicle?.licensePlate} · Checkout in progress
              </Text>
            </View>

            {/* Socket status */}
            <View className="flex-row items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: socketDot }} />
              <Text className="text-xs text-neutral-500">
                {socketStatus === 'connected' ? 'Listening for payment' : 'Connecting'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                disconnect();
                router.back();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-sm text-neutral-400 underline">Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <View className="h-24 w-24 rounded-full bg-success-100 items-center justify-center">
              <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-neutral-900">Payment Confirmed</Text>
              <Text className="text-sm text-neutral-400 text-center leading-5">
                {vehicle?.licensePlate} has been checked out.{'\n'}Tap below to check it in at your terminal.
              </Text>
            </View>
            <Button
              label="Check-in Vehicle"
              className="w-full mt-6"
              loading={checkIn.isPending}
              leftIcon={!checkIn.isPending ? <Ionicons name="checkmark-circle-outline" size={18} color="white" /> : undefined}
              onPress={() => checkIn.mutate(vehicleId!)}
            />
          </>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <>
            <View className="h-24 w-24 rounded-full bg-destructive-100 items-center justify-center">
              <Ionicons name="close-circle" size={56} color="#dc2626" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-neutral-900">Payment Failed</Text>
              <Text className="text-sm text-neutral-400 text-center leading-5">
                {failedMessage ?? 'Something went wrong. Please try again.'}
              </Text>
            </View>
            <Button
              label="Try Again"
              variant="default"
              className="w-full mt-6"
              leftIcon={<Ionicons name="refresh-outline" size={16} color="white" />}
              onPress={() =>
                router.replace({
                  pathname: '/(tabs)/search/resolve',
                  params: {
                    vehicleId,
                    phone,
                  },
                })
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
