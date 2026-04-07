import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert, Button } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { useCheckIn } from '../../../hooks/useCheckIn';
import { parseApiError } from '../../../lib/api-error';
import { toast } from '../../../lib/toast';
import { terminalOperationService } from '../../../services/terminal-operation.service';
import { useMutation, useQuery } from '@tanstack/react-query';

type Step = 'payment' | 'polling' | 'checkin' | 'done';

export default function ResolveScreen() {
  const router = useRouter();
  const { vehicleId, plate, operator, station, duration } =
    useLocalSearchParams<{
      vehicleId: string;
      plate: string;
      operator: string;
      station: string;
      duration: string;
    }>();

  const [step, setStep] = useState<Step>('payment');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const checkIn = useCheckIn();

  // Step 1 — initiate checkout payment
  const resolveConflict = useMutation({
    mutationFn: () => terminalOperationService.resolveConflict(vehicleId!, phone),
    onSuccess: (res) => {
      setTransactionId(res.data.transaction.id);
      setStep('polling');
      toast.info('Payment request sent. Complete payment on your phone.');
    },
    onError: (err) => toast.error(parseApiError(err)),
  });

  // Step 2 — poll transaction status every 5s
  const { data: txStatus } = useQuery({
    queryKey: ['transaction-status', transactionId],
    queryFn: () => terminalOperationService.getTransactionStatus(transactionId!),
    enabled: !!transactionId && step === 'polling',
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (txStatus === 'SUCCESS' && step === 'polling') {
      setStep('checkin');
      toast.success('Payment completed! You can now check in the vehicle.');
    } else if (txStatus === 'FAILED' && step === 'polling') {
      setStep('payment');
      setTransactionId(null);
      toast.error('Payment failed. Please try again.');
    }
  }, [txStatus, step]);

  // Step 3 — check in
  useEffect(() => {
    if (checkIn.isSuccess) {
      setStep('done');
      toast.success('Vehicle checked in successfully');
      router.replace('/(tabs)/search/resolved');
    }
  }, [checkIn.isSuccess]);

  useEffect(() => {
    if (checkIn.isError) toast.error(parseApiError(checkIn.error));
  }, [checkIn.isError]);

  const isValidPhone = /^[97]\d{8}$/.test(phone);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Vehicle">
        <Text className="text-2xl font-bold text-white">Resolve Conflict</Text>
        <Text className="mt-1 text-sm text-zinc-400">
          Check out from current terminal, then check in here
        </Text>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

        {/* Vehicle summary */}
        <View className="rounded-2xl bg-neutral-50 p-4 mb-5">
          <Text className="text-2xl font-black text-neutral-900 mb-3">{plate ?? '—'}</Text>
          <View className="flex-row gap-6">
            {[
              { label: 'Station',  value: station   ?? '—' },
              { label: 'Operator', value: operator  ?? '—' },
              { label: 'Time',     value: duration  ?? '—' },
            ].map((item) => (
              <View key={item.label}>
                <Text className="text-xs text-neutral-400">{item.label}</Text>
                <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step indicators */}
        <View className="flex-row items-center gap-2 mb-5">
          {(['payment', 'polling', 'checkin'] as Step[]).map((s, i) => {
            const done = ['polling', 'checkin', 'done'].indexOf(step) > ['polling', 'checkin', 'done'].indexOf(s) - 1
              || step === 'done';
            const active = step === s;
            return (
              <View key={s} className="flex-row items-center gap-2">
                <View className={`h-6 w-6 rounded-full items-center justify-center ${
                  done || active ? 'bg-primary' : 'bg-neutral-200'
                }`}>
                  {done && step !== s ? (
                    <Ionicons name="checkmark" size={12} color="white" />
                  ) : (
                    <Text className="text-xs font-bold text-white">{i + 1}</Text>
                  )}
                </View>
                <Text className={`text-xs font-medium ${active ? 'text-primary' : 'text-neutral-400'}`}>
                  {s === 'payment' ? 'Pay' : s === 'polling' ? 'Confirm' : 'Check-in'}
                </Text>
                {i < 2 && <View className="flex-1 h-px bg-neutral-200 mx-1" style={{ minWidth: 16 }} />}
              </View>
            );
          })}
        </View>

        {/* Step 1 — phone input */}
        {step === 'payment' && (
          <View className="gap-4">
            <Alert
              variant="warning"
              title="Checkout payment required"
              description="The vehicle must be checked out from its current terminal before checking in here. Enter your phone number to receive the payment request."
            />
            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-neutral-700">Phone Number</Text>
              <View className="flex-row items-center h-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 gap-3">
                <Text className="text-sm font-semibold text-neutral-600">+251</Text>
                <View className="w-px h-5 bg-neutral-200" />
                <TextInput
                  className="flex-1 text-base text-neutral-900"
                  placeholder="9XXXXXXXX"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={(v) => setPhone(v.replace(/\D/g, '').slice(0, 9))}
                  placeholderTextColor="#d1d5db"
                  maxLength={9}
                />
                {phone.length > 0 && (
                  <Ionicons
                    name={isValidPhone ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={isValidPhone ? '#16a34a' : '#ef4444'}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Step 2 — waiting for payment */}
        {step === 'polling' && (
          <View className="items-center gap-4 py-8">
            <ActivityIndicator size="large" color="#1d4ed8" />
            <Text className="text-base font-semibold text-neutral-900">Waiting for payment…</Text>
            <Text className="text-sm text-neutral-400 text-center">
              Complete the payment on your phone (+251{phone}). This page will update automatically.
            </Text>
            <TouchableOpacity onPress={() => { setStep('payment'); setTransactionId(null); }}>
              <Text className="text-sm text-neutral-400 underline">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3 — ready to check in */}
        {step === 'checkin' && (
          <Alert
            variant="success"
            title="Payment confirmed"
            description="The vehicle has been checked out. Tap the button below to check it in at your terminal."
          />
        )}
      </ScrollView>

      <View className="px-4 pb-6 pt-3 border-t border-neutral-100">
        {step === 'payment' && (
          <Button
            label="Send Payment Request"
            className="w-full"
            loading={resolveConflict.isPending}
            disabled={!isValidPhone}
            leftIcon={!resolveConflict.isPending ? <Ionicons name="flash" size={16} color="white" /> : undefined}
            onPress={() => resolveConflict.mutate()}
          />
        )}
        {step === 'checkin' && (
          <Button
            label="Check-in Vehicle"
            className="w-full"
            loading={checkIn.isPending}
            leftIcon={!checkIn.isPending ? <Ionicons name="checkmark-circle-outline" size={18} color="white" /> : undefined}
            onPress={() => checkIn.mutate(vehicleId!)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
