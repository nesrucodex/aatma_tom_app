import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, EmptyState, SelectSheet, type SelectOption } from '../../components';
import { ActivityRow } from '../../components/features/home/ActivityRow';
import { StatCards } from '../../components/features/home/StatCard';
import { useAssociationAnalytics, useTerminalOperations } from '../../hooks/useHomeData';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth.store';
import ScreeenHeader from '@/components/shared/ScreeenHeader';

const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English', sublabel: 'English', icon: 'language-outline' },
  { value: 'am', label: 'አማርኛ', sublabel: 'Amharic', icon: 'language-outline' },
];

type Filter = 'all' | 'CHECK_IN' | 'CHECK_OUT';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'CHECK_IN', label: 'Checked In' },
  { key: 'CHECK_OUT', label: 'Checked Out' },
];

function StatSkeleton() {
  return (
    <View className="flex-row gap-3 px-4 pb-4">
      {[1, 2, 3].map((i) => (
        <View key={i} className="w-44 h-24 rounded-2xl bg-zinc-800 animate-pulse" />
      ))}
    </View>
  );
}

function ActivitySkeleton() {
  return (
    <View className="gap-2.5">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="h-16 rounded-2xl bg-neutral-100" />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<Filter>('all');
  const [language, setLanguage] = useState('en');
  const langSheetRef = useRef<BottomSheet>(null);

  const terminalId = (user?.terminalOperator as any)?.association?.terminalId as string | undefined;

  const { data: analyticsData, isLoading: analyticsLoading } = useAssociationAnalytics();
  const { data: operationsData, isLoading: operationsLoading } = useTerminalOperations(terminalId);

  const analytics = analyticsData?.data.analytics;
  const operations = operationsData?.data.operations ?? [];

  const filtered = filter === 'all'
    ? operations
    : operations.filter((op) => op.type === filter);

  const currentLang = LANGUAGES.find((l) => l.value === language);

  const stats = analytics
    ? [
      { icon: 'car-outline' as const, iconColor: '#60a5fa', value: String(analytics.operationsByType.checkIn), label: 'Checked In' },
      { icon: 'cash-outline' as const, iconColor: '#34d399', value: `${analytics.totalRevenue.toLocaleString()} ETB`, label: 'Total Revenue' },
      { icon: 'people-outline' as const, iconColor: '#fb923c', value: String(analytics.activeOperators), label: 'Active Operators' },
      { icon: 'arrow-forward-outline' as const, iconColor: '#a78bfa', value: String(analytics.operationsByType.checkOut), label: 'Checked Out' },
    ]
    : [];

  console.log({ filtered: filtered.map(f => f.checkInTerminalOperator) })

  return (
    <>
      <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>
        <ScreeenHeader className="px-0 pt-0">
          <View className="flex-row items-center justify-between px-5 py-5">
            <View className="flex-row items-center gap-3">
              <Avatar initials={(user?.name ?? 'U').slice(0, 2).toUpperCase()} size="md" bgColor="white" textColor="black" />
              <View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-semibold text-white">{user?.name ?? 'Manager'}</Text>
                  <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />
                </View>
                <Text className="text-xs text-gray-400">{user?.role?.replace(/_/g, ' ')}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => langSheetRef.current?.expand()}
              className="flex-row items-center gap-1">
              <Text className="text-sm font-medium text-white">{currentLang?.label}</Text>
              <Ionicons name="chevron-down" size={14} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {analyticsLoading ? (
            <StatSkeleton />
          ) : (
            <StatCards items={stats} />
          )}
        </ScreeenHeader>

        {/* Live Activity */}
        <View className="flex-1 px-4 pt-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <Text className="text-base font-bold text-gray-900">Live Activity</Text>
              {operationsLoading && (
                <ActivityIndicator size="small" color="#6b7280" />
              )}
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
            {operationsLoading ? (
              <ActivitySkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="car-outline"
                title="No activity today"
                description="No check-ins or check-outs in the last 24 hours."
              />
            ) : (
              filtered.map((op) => (
                <ActivityRow
                  key={op.id}
                  plate={op.vehicle.licensePlate}
                  operator={op.checkInTerminalOperator?.user?.name ?? op.checkInTerminalOperator?.userId ?? '—'}
                  time={new Date(op.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  status={op.type === 'CHECK_IN' ? 'checked-in' : 'checked-out'}
                  station={op.terminal.name}
                />
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

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
