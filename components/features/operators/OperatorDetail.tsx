import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Avatar } from '../../../components';

interface LogItem {
  label: string;
}

interface OperatorDetailProps {
  initials: string;
  name: string;
  station: string;
  carsHandled: number;
  revenue: string;
  issues: number;
  log: LogItem[];
}

export function OperatorDetail({
  initials,
  name,
  station,
  carsHandled,
  revenue,
  issues,
  log,
}: OperatorDetailProps) {
  return (
    <View className="gap-6 pb-8">
      {/* Identity */}
      <View className="flex-row items-center gap-4">
        <Avatar initials={initials} size="lg" />
        <View>
          <Text className="text-xl font-bold text-neutral-900">{name}</Text>
          <Text className="mt-0.5 text-sm text-neutral-400">{station}</Text>
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-neutral-50 p-4">
          <Text className="text-xs font-medium text-neutral-400 mb-1">Cars Handled</Text>
          <Text className="text-3xl font-black text-neutral-900">{carsHandled}</Text>
        </View>
        <View className="flex-1 rounded-2xl bg-neutral-50 p-4">
          <Text className="text-xs font-medium text-neutral-400 mb-1">Revenue</Text>
          <Text className="text-2xl font-black text-neutral-900">{revenue}</Text>
        </View>
      </View>

      {/* Issues banner */}
      {issues > 0 && (
        <View className="flex-row items-start gap-3 rounded-2xl bg-warning-50 border border-warning-200 p-4">
          <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-warning-100">
            <Ionicons name="warning" size={16} color="#d97706" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-warning-800">
              {issues} Issue{issues > 1 ? 's' : ''} Reported
            </Text>
            <Text className="mt-0.5 text-xs text-warning-600">
              Missed checkouts and overrides detected
            </Text>
          </View>
        </View>
      )}

      {/* Activity log */}
      <View>
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="time-outline" size={15} color="#6b7280" />
          <Text className="text-sm font-bold text-neutral-700">Activity Log</Text>
        </View>
        <View className="gap-0">
          {log.map((item, i) => (
            <View
              key={i}
              className="flex-row items-start gap-3 py-3 border-b border-neutral-100">
              <View className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-300" />
              <Text className="flex-1 text-sm text-neutral-600">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
