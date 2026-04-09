import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert, Button, Collapsible } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { useVehicleById, useVehicleDetail } from '../../../hooks/useVehicleDetail';
import { cn } from '../../../lib/utils';
import { useVehicleDrivedData } from '@/hooks/useVehicleDrivedData';

export default function VehicleScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  const { data: vehicle, isLoading: vehicleLoading } = useVehicleById(vehicleId);
  const { operations, isLoading: opsLoading, isError, refetch } = useVehicleDetail(vehicleId);
  const isLoading = vehicleLoading || opsLoading;

  const {
    isCheckedIn,
    isCheckedOut,
    station,
    operator,
    duration,
    routeName,
    canResolveAndCheckIn,
  } = useVehicleDrivedData(
    vehicle,
    operations,
  );


  const statusLabel = isCheckedIn ? 'Checked In' : isCheckedOut ? 'Checked Out' : '—';
  const plate = vehicle?.licensePlate ?? vehicleId;
  const type = vehicle?.type ?? '';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Search">
        <Text className="text-2xl font-bold text-white">{plate}</Text>
        {type ? <Text className="mt-1 text-xs text-zinc-400">{type}</Text> : null}
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

        {/* Check-in info */}
        {isCheckedIn && !isLoading && (
          <View className="rounded-2xl bg-neutral-50 p-4 mb-4">
            <Text className="text-xs font-semibold text-neutral-400 tracking-widest mb-4">
              CHECK-IN INFORMATION
            </Text>
            <View className="flex-row gap-6">
              {[
                { label: 'Terminal', value: station },
                { label: 'Operator', value: operator },
                { label: 'Since', value: duration },
              ].map((item) => (
                <View key={item.label}>
                  <Text className="text-xs text-neutral-400">{item.label}</Text>
                  <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Vehicle info */}
        <View className="rounded-2xl bg-neutral-50 p-4 mb-4">
          <Text className="text-xs font-semibold text-neutral-400 tracking-widest mb-4">
            VEHICLE INFORMATION
          </Text>
          <View className="flex-row flex-wrap gap-y-4">
            <View className="w-1/2">
              <Text className="text-xs text-neutral-400 mb-0.5">Type</Text>
              <Text className="text-sm font-bold text-neutral-900">{type || '—'}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-neutral-400 mb-0.5">Status</Text>
              <Text className={cn('text-sm font-bold', {
                'text-primary': isCheckedIn,
                'text-success-600': isCheckedOut,
                'text-neutral-400': !isCheckedIn && !isCheckedOut,
              })}>
                {statusLabel}
              </Text>
            </View>
            <View className="w-full">
              <Text className="text-xs text-neutral-400 mb-0.5">Assigned Route</Text>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="map-outline" size={13} color={routeName ? '#2563eb' : '#9ca3af'} />
                <Text className={`text-sm font-bold ${routeName ? 'text-primary' : 'text-neutral-400'}`}>
                  {routeName || 'No route assigned'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {isError && (
          <Alert variant="destructive" title="Failed to load operations" description="Could not fetch activity history." className="mb-4">
            <Button label="Retry" size="sm" variant="outline" className="mt-2" onPress={() => refetch()} />
          </Alert>
        )}

        {/* Full timeline */}
        <View className="rounded-2xl bg-neutral-50 p-4">
          {isLoading ? (
            <View className="flex-row items-center gap-2">
              <Ionicons name="receipt-outline" size={14} color="#9ca3af" />
              <Text className="flex-1 text-sm font-bold text-neutral-700">Full Activity Timeline</Text>
              <ActivityIndicator size="small" color="#9ca3af" />
            </View>
          ) : (
            <Collapsible icon="receipt-outline" title="Full Activity Timeline" badge={operations.length || undefined}>
              {operations.length === 0 ? (
                <Text className="text-xs text-neutral-400">No operations recorded</Text>
              ) : operations.map((op, i) => {
                const opStation = op.terminal?.name ?? op.checkInTerminalOperator?.association?.terminal?.name ?? '—';
                const opOperator = op.checkInTerminalOperator?.user?.name ?? '—';
                const opTime = new Date(op.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const opDate = new Date(op.checkInAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
                return (
                  <View key={op.id} className="flex-row items-start gap-3">
                    <View className="items-center">
                      <View className={`h-2.5 w-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-primary' : 'bg-neutral-300'}`} />
                      {i < operations.length - 1 && (
                        <View className="w-px flex-1 bg-neutral-200 mt-1" style={{ minHeight: 20 }} />
                      )}
                    </View>
                    <View className="flex-1 pb-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-neutral-900">
                          {op.type === 'CHECK_IN' ? 'Checked in' : 'Checked out'}
                        </Text>
                        <Text className="text-xs text-neutral-400">{opDate} · {opTime}</Text>
                      </View>
                      <Text className="text-xs text-neutral-400 mt-0.5">{opStation} · {opOperator}</Text>
                    </View>
                  </View>
                );
              })}
            </Collapsible>
          )}
        </View>

        {canResolveAndCheckIn && (
          <View className="mt-4 pt-3 border-t border-neutral-100">
            <Button
              label="Resolve & Check-in"
              className="w-full"
              leftIcon={<Ionicons name="flash" size={16} color="white" />}
              onPress={() => router.push({ pathname: '/(tabs)/search/resolve', params: { vehicleId } })}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
