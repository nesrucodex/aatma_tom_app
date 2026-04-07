import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, RadioOption } from '../../../components';

const STATIONS = [
  { id: 'mexico', label: 'Mexico Station', sublabel: 'Current location' },
  { id: 'kazanchis', label: 'Kazanchis Station', sublabel: 'Conflicting location' },
];

const TIMELINE = [
  { time: '11:00 AM', station: 'Kazanchis', label: 'Checked in', active: true },
];

export default function ResolveScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('mexico');

  const selectedStation = STATIONS.find((s) => s.id === selected);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-3">
          <Ionicons name="chevron-back" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-400">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Resolve Conflict</Text>
        <Text className="text-sm text-gray-400 mt-1">Review and fix the conflict below</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Dual check-in warning */}
        <Card variant="warning" padding="md" className="mb-4 gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning-outline" size={14} color="#d97706" />
            <Text className="text-sm font-semibold text-yellow-700">Dual Check-in Detected</Text>
          </View>
          <Text className="text-xs text-yellow-600">
            This vehicle is checked in at two stations simultaneously. Select which station to keep
            and the other will be auto-checked-out.
          </Text>
        </Card>

        {/* Vehicle summary */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-white mb-3">AA-51678</Text>
          <View className="flex-row gap-6">
            {[
              { label: 'Operator', value: 'Sara M.' },
              { label: 'Duration', value: '1h 15m' },
              { label: 'Stations', value: '2' },
            ].map((item) => (
              <View key={item.label} className="flex-row items-center gap-1">
                <Ionicons name="person-outline" size={13} color="#9ca3af" />
                <View>
                  <Text className="text-xs text-gray-400">{item.label}</Text>
                  <Text className="text-sm font-semibold text-white">{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Station picker */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
          KEEP CHECKED IN AT
        </Text>
        <View className="gap-3 mb-4">
          {STATIONS.map((station) => (
            <RadioOption
              key={station.id}
              label={station.label}
              sublabel={station.sublabel}
              selected={selected === station.id}
              onPress={() => setSelected(station.id)}
            />
          ))}
        </View>

        {/* Timeline */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="receipt-outline" size={13} color="#6b7280" />
            <Text className="text-xs font-semibold text-gray-400">Activity Timeline</Text>
          </View>
          {TIMELINE.map((item, i) => (
            <View key={i} className="flex-row items-start gap-3 py-1">
              <View
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.active ? 'bg-yellow-400' : 'bg-gray-500'}`}
              />
              <View>
                <Text className="text-sm font-semibold text-white">{item.label}</Text>
                <Text className="text-xs text-gray-400">
                  {item.time} · {item.station}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2">
        <Button
          label={`Resolve & Check-in at ${selectedStation?.label.split(' ')[0]}`}
          className="w-full"
          leftIcon={<Ionicons name="flash-outline" size={16} color="white" />}
          onPress={() => router.replace('/(tabs)/search/resolved')}
        />
      </View>
    </SafeAreaView>
  );
}
