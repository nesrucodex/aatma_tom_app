import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card } from '../../../components';

const INFO_ITEMS: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string; valueClass?: string }[] = [
  { icon: 'location-outline', label: 'Station', value: 'Mexico' },
  { icon: 'person-outline', label: 'Operator', value: 'Sara M.' },
  { icon: 'time-outline', label: 'Duration', value: '1h 15m' },
  { icon: 'warning-outline', label: 'Status', value: 'Conflict', valueClass: 'text-yellow-500' },
];

const TIMELINE = [
  { time: '11:00 AM', station: 'Kazanchis', label: 'Checked in', active: true },
  { time: '10:45 AM', station: 'Mexico', label: 'Checked in', active: false },
  { time: '9:30 AM', station: 'Bole', label: 'Checked out', active: false },
];

export default function VehicleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-3">
          <Ionicons name="chevron-back" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-400">Back</Text>
        </TouchableOpacity>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">AA-51678</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="warning-outline" size={14} color="#f59e0b" />
            <Text className="text-sm font-semibold text-yellow-400">Conflict</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Vehicle info grid */}
        <Card variant="default" padding="md" className="mx-4 mb-4">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            VEHICLE INFORMATION
          </Text>
          <View className="flex-row flex-wrap gap-y-4">
            {INFO_ITEMS.map((item) => (
              <View key={item.label} className="w-1/2 flex-row items-start gap-2">
                <Ionicons name={item.icon} size={16} color="#9ca3af" style={{ marginTop: 2 }} />
                <View>
                  <Text className="text-xs text-gray-400">{item.label}</Text>
                  <Text className={`text-sm font-semibold ${item.valueClass ?? 'text-gray-900'}`}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Conflict warning */}
        <Card variant="warning" padding="md" className="mx-4 mb-4 gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning-outline" size={14} color="#d97706" />
            <Text className="text-sm font-semibold text-yellow-700">
              Active at Kazanchis Station
            </Text>
          </View>
          <Text className="text-xs text-yellow-600">
            This vehicle is checked in at two stations. Resolve the conflict to continue operations.
          </Text>
          <Button
            label="Resolve Conflict"
            size="md"
            className="mt-3 w-full bg-yellow-400 active:bg-yellow-500 rounded-xl"
            onPress={() => router.push('/(tabs)/search/resolve')}
          />
        </Card>

        {/* Full timeline */}
        <Card variant="default" padding="md" className="mx-4 mb-6 gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="receipt-outline" size={14} color="#6b7280" />
            <Text className="text-sm font-semibold text-gray-700">Full Activity Timeline</Text>
          </View>
          {TIMELINE.map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.active ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
              <View>
                <Text className="text-sm font-semibold text-gray-900">{item.label}</Text>
                <Text className="text-xs text-gray-400">
                  {item.time} · {item.station}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-4 pb-6 pt-2">
        <Button
          label="Resolve & Check-in"
          className="w-full"
          leftIcon={<Ionicons name="flash-outline" size={16} color="white" />}
          onPress={() => router.push('/(tabs)/search/resolve')}
        />
      </View>
    </SafeAreaView>
  );
}
