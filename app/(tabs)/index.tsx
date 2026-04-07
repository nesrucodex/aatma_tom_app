import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, SelectSheet, type SelectOption } from '../../components';
import { ActivityRow } from '../../components/features/home/ActivityRow';
import { StatCards } from '../../components/features/home/StatCard';
import { cn } from '../../lib/utils';
import ScreeenHeader from '@/components/shared/ScreeenHeader';

const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English', sublabel: 'English', icon: 'language-outline' },
  { value: 'am', label: 'አማርኛ', sublabel: 'Amharic', icon: 'language-outline' },
];

const STATS = [
  { icon: 'car-outline' as const, iconColor: '#60a5fa', value: '234', label: 'Active Cars' },
  { icon: 'cash-outline' as const, iconColor: '#34d399', value: '12,580 ETB', label: 'Today Revenue' },
  { icon: 'arrow-forward-outline' as const, iconColor: '#a78bfa', value: '15', label: 'Checked Out' },
  { icon: 'people-outline' as const, iconColor: '#fb923c', value: '8', label: 'Operators On' },
];

const ACTIVITY = [
  { id: '1', plate: 'ABC-1234', operator: 'Alemu S.', time: '9:30 AM', status: 'checked-out' as const, station: 'Kazanchis' },
  { id: '2', plate: 'XYZ-8890', operator: 'Dawit S.', time: '9:30 AM', status: 'checked-in' as const, station: 'Kazanchis' },
  { id: '3', plate: 'DEF-5678', operator: 'Haile S.', time: '9:30 AM', status: 'checked-in' as const, station: 'Kazanchis' },
  { id: '4', plate: 'GHI-9012', operator: 'Geremew S.', time: '9:30 AM', status: 'checked-out' as const, station: 'Kazanchis' },
  { id: '5', plate: 'JKL-3456', operator: 'Boris S.', time: '9:30 AM', status: 'checked-in' as const, station: 'Kazanchis' },
];

type Filter = 'all' | 'checked-in' | 'checked-out';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'checked-in', label: 'Checked In' },
  { key: 'checked-out', label: 'Checked Out' },
];

export default function HomeScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [language, setLanguage] = useState('en');
  const langSheetRef = useRef<BottomSheet>(null);

  const currentLang = LANGUAGES.find((l) => l.value === language);
  const filtered = filter === 'all' ? ACTIVITY : ACTIVITY.filter((a) => a.status === filter);

  return (
    <>
      <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>
        {/* Dark header */}
        <ScreeenHeader className="px-0 pt-0">
          <View className="flex-row items-center justify-between px-5 py-6">
            <View className="flex-row items-center gap-3">
              <Avatar initials="JS" size="md" bgColor='white' textColor='black' />
              <View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-semibold text-white">Joshua Smith</Text>
                  <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />
                </View>
                <Text className="text-xs text-gray-400">Operator Manager</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => langSheetRef.current?.expand()}
              className="flex-row items-center gap-1">
              <Text className="text-sm font-medium text-white">{currentLang?.label}</Text>
              <Ionicons name="chevron-down" size={14} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <StatCards items={STATS} />
        </ScreeenHeader>

        {/* Live Activity */}
        <View className="flex-1 px-4 pt-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <Text className="text-base font-bold text-gray-900">Live Activity</Text>
            </View>

            <View className="flex-row">
              {FILTERS.map(({ key, label }) => {
                const active = filter === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setFilter(key)}
                    className={cn('px-3 py-1 border-b-2 border-transparent', {
                      'border-blue-600': active,
                    })}>
                    <Text className={cn('text-xs font-semibold text-gray-400', { 'text-blue-600': active })}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.map((item) => (
              <ActivityRow key={item.id} {...item} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Language picker sheet — outside SafeAreaView so the portal renders correctly */}
      <SelectSheet
        ref={langSheetRef}
        title="Select Language"
        subtitle="Choose your preferred language"
        options={LANGUAGES}
        selected={language}
        onSelect={setLanguage}
      />
    </>
  );
}
