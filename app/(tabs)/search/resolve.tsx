import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert, Button, PhoneInput } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { useVehicleById, useVehicleDetail } from '../../../hooks/useVehicleDetail';
import { parseApiError } from '../../../lib/api-error';
import { toast } from '../../../lib/toast';
import { terminalOperationService } from '../../../services/terminal-operation.service';
import { useVehicleDrivedData } from '@/hooks/useVehicleDrivedData';
import { debug } from '@/lib/debug';

export default function ResolveScreen() {
  const router = useRouter();
  const { vehicleId, phone: initialPhone } =
    useLocalSearchParams<{ vehicleId: string; phone?: string }>();

  const { data: vehicle } = useVehicleById(vehicleId);
  const { operations } = useVehicleDetail(vehicleId);
  const { station, operator, duration } = useVehicleDrivedData(
    vehicle,
    operations,
  );

  const plate = vehicle?.licensePlate ?? vehicleId;
  const [phone, setPhone] = useState(initialPhone ?? '');
  const isValidPhone = /^[97]\d{8}$/.test(phone);

  const resolveConflict = useMutation({
    mutationFn: () => terminalOperationService.resolveConflict(vehicleId!, `+251${phone}`),
    onSuccess: (res) => {
      router.push({
        pathname: '/(tabs)/search/pending',
        params: { vehicleId, operationId: res.data.operationId, phone },
      });
    },
    onError: (err) => toast.error(parseApiError(err)),
  });

  debug.log("Driver metadata", {
    vehicle
  })

  useEffect(() => {
    if(vehicle?.vehicleMetadata) {
      setPhone(vehicle.vehicleMetadata.driverPhone?.replace("+251", "") || "")
    }
  }, [vehicle?.vehicleMetadata])

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Vehicle">
        <Text className="text-2xl font-bold text-white">Resolve Conflict</Text>
        <Text className="mt-1 text-sm text-zinc-400">
          Check out from current terminal, then check in here
        </Text>
      </ScreeenHeader>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

          <View className="rounded-2xl bg-neutral-50 p-4 mb-5">
            <Text className="text-2xl font-black text-neutral-900 mb-3">{plate}</Text>
            <View className="flex-row gap-6">
              {[
                { label: 'Station', value: station },
                { label: 'Operator', value: operator },
                { label: 'Time', value: duration },
              ].map((item) => (
                <View key={item.label}>
                  <Text className="text-xs text-neutral-400">{item.label}</Text>
                  <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-4">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              onSubmit={() => isValidPhone && resolveConflict.mutate()}
            />
            <Alert
              variant="info"
              title="Checkout payment required"
              description="Enter the driver's phone number to send a payment request. Once paid, the vehicle will be checked out and you can check it in here."
            />
          </View>
        </ScrollView>

        <View className="px-4 pb-6 pt-3 border-t border-neutral-100">
          <Button
            label="Send Payment Request"
            className="w-full"
            loading={resolveConflict.isPending}
            disabled={!isValidPhone}
            leftIcon={!resolveConflict.isPending ? <Ionicons name="flash" size={16} color="white" /> : undefined}
            onPress={() => resolveConflict.mutate()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
