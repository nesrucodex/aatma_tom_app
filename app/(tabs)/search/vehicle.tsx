import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';

const INFO_ITEMS = [
  { label: 'Station', value: 'Mexico' },
  { label: 'Operator', value: 'Sara M.' },
  { label: 'Duration', value: '1h 15m' },
  { label: 'Status', value: 'Conflict' },
];

const TIMELINE = [
  { time: '11:00 AM', station: 'Kazanchis', label: 'Checked in', active: true },
  { time: '10:45 AM', station: 'Mexico', label: 'Checked in', active: false },
  { time: '9:30 AM', station: 'Bole', label: 'Checked out', active: false },
];

export default function VehicleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Search">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">AA-51678</Text>
          <Badge label="Conflict" variant="warning" />
        </View>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

        {/* Info grid */}
        <View className="rounded-2xl bg-neutral-50 p-4 mb-4">
          <Text className="text-xs font-semibold text-neutral-400 tracking-widest mb-4">
            VEHICLE INFORMATION
          </Text>
          <View className="flex-row flex-wrap gap-y-4">
            {INFO_ITEMS.map((item) => (
              <View key={item.label} className="w-1/2">
                <Text className="text-xs text-neutral-400 mb-0.5">{item.label}</Text>
                <Text className={`text-sm font-bold ${item.label === 'Status' ? 'text-warning-600' : 'text-neutral-900'}`}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Conflict warning */}
        <View className="rounded-2xl bg-warning-50 border border-warning-200 p-4 mb-4 gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning" size={15} color="#d97706" />
            <Text className="text-sm font-bold text-warning-700">
              Active at Kazanchis Station
            </Text>
          </View>
          <Text className="text-xs text-warning-600 leading-4">
            This vehicle is checked in at two stations. Resolve the conflict to continue operations.
          </Text>
          <Button
            label="Resolve Conflict"
            size="md"
            className="mt-1 w-full bg-warning-500 active:bg-warning-600 rounded-xl"
            onPress={() => router.push('/(tabs)/search/resolve')}
          />
        </View>

        {/* Full timeline */}
        <View className="rounded-2xl bg-neutral-50 p-4 gap-3">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="receipt-outline" size={14} color="#9ca3af" />
            <Text className="text-sm font-bold text-neutral-700">Full Activity Timeline</Text>
          </View>
          {TIMELINE.map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.active ? 'bg-primary' : 'bg-neutral-300'}`}
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-neutral-900">{item.label}</Text>
                <Text className="text-xs text-neutral-400">{item.time} · {item.station}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* Bottom CTA */}
        <View className="mt-4 pt-3 border-t border-neutral-100">
          <Button
            label="Resolve & Check-in"
            className="w-full"
            leftIcon={<Ionicons name="flash" size={16} color="white" />}
            onPress={() => router.push('/(tabs)/search/resolve')}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
