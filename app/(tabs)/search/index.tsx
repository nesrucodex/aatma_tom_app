import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { VehicleCard } from '../../../components/features/search/VehicleCard';

const RESULTS = [
  {
    id: '1',
    plate: '3AA-05678',
    status: 'checked-out' as const,
    station: 'Kazanchis',
    operator: 'Daniel T.',
    duration: '45m ago',
    timeline: [
      { label: 'Checked out', time: '9:30 AM', station: 'Kazanchis' },
      { label: 'Checked in',  time: '8:45 AM', station: 'Kazanchis' },
    ],
  },
  {
    id: '2',
    plate: 'AA-51678',
    status: 'conflict' as const,
    station: 'Mexico',
    operator: 'Sara M.',
    duration: '1h 15m',
    conflictStation: 'Kazanchis Station',
    timeline: [
      { label: 'Checked in', time: '11:00 AM', station: 'Kazanchis' },
      { label: 'Checked in', time: '10:45 AM', station: 'Mexico'    },
    ],
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader>
        <Text className="text-2xl font-bold text-white mb-4">Search Vehicle</Text>
        <View className="flex-row items-center gap-3 rounded-2xl bg-zinc-800 px-4 h-14">
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            className="flex-1 text-base text-white"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#4b5563"
            placeholder="Try: AA-12345, OR-88900, AA-56708"
          />
        </View>
        <Text className="mt-2 text-xs text-zinc-500">
          Try: AA-12345, OR-88900, AA-56708
        </Text>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
        {RESULTS.map((item) => (
          <VehicleCard
            key={item.id}
            {...item}
            onAction={() =>
              item.status === 'conflict'
                ? router.push('/(tabs)/search/resolve')
                : router.push('/(tabs)/search/vehicle')
            }
            onViewDetail={() => router.push('/(tabs)/search/vehicle')}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
