import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, RadioOption } from '../../../components';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';

const STATIONS = [
  { id: 'mexico', label: 'Mexico Station', sublabel: 'Current location' },
  { id: 'kazanchis', label: 'Kazanchis Station', sublabel: 'Conflicting location' },
];

const TIMELINE = [
  { time: '11:00 AM', station: 'Kazanchis', label: 'Checked in', active: true },
  { time: '10:45 AM', station: 'Mexico', label: 'Checked in', active: false },
];

const INFO = [
  { label: 'Operator', value: 'Sara M.' },
  { label: 'Duration', value: '1h 15m' },
  { label: 'Stations', value: '2' },
];

export default function ResolveScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('mexico');

  const selectedStation = STATIONS.find((s) => s.id === selected);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={() => router.back()} backLabel="Vehicle">
        <Text className="text-2xl font-bold text-white">Resolve Conflict</Text>
        <Text className="mt-1 text-sm text-zinc-400">Review and fix the conflict below</Text>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

        {/* Dual check-in warning */}
        <View className="rounded-2xl bg-warning-50 border border-warning-200 p-4 mb-5 gap-1.5">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning" size={15} color="#d97706" />
            <Text className="text-sm font-bold text-warning-700">Dual Check-in Detected</Text>
          </View>
          <Text className="text-xs leading-4 text-warning-600">
            This vehicle is checked in at two stations simultaneously. Select which station to keep
            and the other will be auto-checked-out.
          </Text>
        </View>

        {/* Vehicle summary */}
        <View className="rounded-2xl bg-neutral-50 p-4 mb-5">
          <Text className="text-2xl font-black text-neutral-900 mb-3">AA-51678</Text>
          <View className="flex-row gap-6">
            {INFO.map((item) => (
              <View key={item.label}>
                <Text className="text-xs text-neutral-400">{item.label}</Text>
                <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Station picker */}
        <Text className="text-xs font-semibold text-neutral-400 tracking-widest mb-3">
          KEEP CHECKED IN AT
        </Text>
        <View className="gap-3 mb-5">
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
        <View className="rounded-2xl bg-neutral-50 p-4 gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="receipt-outline" size={14} color="#9ca3af" />
            <Text className="text-sm font-bold text-neutral-700">Activity Timeline</Text>
          </View>
          {TIMELINE.map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.active ? 'bg-warning-400' : 'bg-neutral-300'}`}
              />
              <View>
                <Text className="text-sm font-semibold text-neutral-900">{item.label}</Text>
                <Text className="text-xs text-neutral-400">{item.time} · {item.station}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="mt-4 pt-3 border-t border-neutral-100">
          <Button
            label={`Resolve & Check-in at ${selectedStation?.label.split(' ')[0]}`}
            className="w-full"
            leftIcon={<Ionicons name="flash" size={16} color="white" />}
            onPress={() => router.replace('/(tabs)/search/resolved')}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
