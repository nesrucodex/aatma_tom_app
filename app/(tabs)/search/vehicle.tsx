import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert, Badge, Button } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { useVehicleDetail } from '../../../hooks/useVehicleDetail';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function VehicleScreen() {
  const router = useRouter();
  const { id, plate, type, routeName, status } =
    useLocalSearchParams<{ id: string; plate: string; type: string; routeName: string; status: string }>();

  const { operations, isLoading, isError, refetch } = useVehicleDetail(id);

  const [timelineOpen, setTimelineOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleTimeline = () => {
    LayoutAnimation.configureNext({
      duration: 260,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut', property: 'scaleY' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    Animated.timing(rotation, {
      toValue: timelineOpen ? 0 : 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
    setTimelineOpen((p) => !p);
  };

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  // Latest operation = currently active state
  const latestOp = operations[0];
  const isCheckedIn = latestOp?.type === 'CHECK_IN';
  const isCheckedOut = !isCheckedIn;

  const currentStation = latestOp?.terminal?.name
    ?? latestOp?.checkInTerminalOperator?.association?.terminal?.name
    ?? '—';
  const currentOperator = latestOp?.checkInTerminalOperator?.user?.name ?? '—';
  const checkedInAt = latestOp
    ? new Date(latestOp.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  const statusLabel = isCheckedIn ? 'Checked In' : 'Checked Out';
  const statusVariant: 'default' | 'success' = isCheckedIn ? 'default' : 'success';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Search">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">{plate}</Text>
          {!isLoading && <Badge label={statusLabel} variant={statusVariant} />}
        </View>
        {type ? <Text className="mt-1 text-xs text-zinc-400">{type}</Text> : null}
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

        {/* Current status card — only when checked in */}
        {isCheckedIn && !isLoading && (
          <View className="rounded-2xl bg-primary-50 border border-primary-200 p-4 mb-4 gap-3">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <Text className="text-sm font-bold text-primary-700">Currently Checked In</Text>
            </View>
            <View className="flex-row gap-6">
              <View>
                <Text className="text-xs text-primary-400">Terminal</Text>
                <Text className="text-sm font-bold text-primary-900">{currentStation}</Text>
              </View>
              <View>
                <Text className="text-xs text-primary-400">Operator</Text>
                <Text className="text-sm font-bold text-primary-900">{currentOperator}</Text>
              </View>
              <View>
                <Text className="text-xs text-primary-400">Since</Text>
                <Text className="text-sm font-bold text-primary-900">{checkedInAt}</Text>
              </View>
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
              <Text className={`text-sm font-bold ${isCheckedIn ? 'text-primary' : 'text-success-600'}`}>
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

        {/* Error */}
        {isError && (
          <Alert
            variant="destructive"
            title="Failed to load operations"
            description="Could not fetch activity history."
            className="mb-4">
            <Button label="Retry" size="sm" variant="outline" className="mt-2" onPress={() => refetch()} />
          </Alert>
        )}

        {/* Collapsible full timeline */}
        <View className="rounded-2xl bg-neutral-50 p-4">
          <TouchableOpacity
            onPress={toggleTimeline}
            activeOpacity={0.7}
            className="flex-row items-center gap-2">
            <Ionicons name="receipt-outline" size={14} color="#9ca3af" />
            <Text className="flex-1 text-sm font-bold text-neutral-700">Full Activity Timeline</Text>

            {/* Operation count badge */}
            {!isLoading && operations.length > 0 && (
              <View className="rounded-full bg-neutral-200 px-2 py-0.5 mr-1">
                <Text className="text-xs font-bold text-neutral-600">{operations.length}</Text>
              </View>
            )}

            {isLoading ? (
              <ActivityIndicator size="small" color="#9ca3af" />
            ) : (
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </Animated.View>
            )}
          </TouchableOpacity>

          {timelineOpen && (
            <View className="mt-4 gap-3">
              {operations.length === 0 ? (
                <Text className="text-xs text-neutral-400">No operations recorded</Text>
              ) : (
                operations.map((op, i) => {
                  const opStation = op.terminal?.name
                    ?? op.checkInTerminalOperator?.association?.terminal?.name
                    ?? '—';
                  const opOperator = op.checkInTerminalOperator?.user?.name ?? '—';
                  const opTime = new Date(op.checkInAt).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit',
                  });
                  const opDate = new Date(op.checkInAt).toLocaleDateString([], {
                    month: 'short', day: 'numeric',
                  });

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
                        <Text className="text-xs text-neutral-400 mt-0.5">
                          {opStation} · {opOperator}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>

        {/* CTA */}
        <View className="mt-4 pt-3 border-t border-neutral-100">
          <Button
            label={isCheckedOut ? 'Check-in' : 'Resolve & Check-in'}
            className="w-full"
            leftIcon={
              <Ionicons
                name={isCheckedOut ? 'checkmark-circle-outline' : 'flash'}
                size={16}
                color="white"
              />
            }
            onPress={() => router.push('/(tabs)/search/resolve')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
