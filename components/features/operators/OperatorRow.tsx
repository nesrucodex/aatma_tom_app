import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '../../../components';

interface OperatorRowProps {
  name: string;
  role: string;
  revenue: string;
  operationsHandled: number;
  emergencyRequestCount: number;
  onPress?: () => void;
}

export function OperatorRow({
  name,
  role,
  revenue,
  operationsHandled,
  emergencyRequestCount,
  onPress,
}: OperatorRowProps) {
  const initials = (name ?? '?').slice(0, 2).toUpperCase();
  const roleLabel = role.replace(/_/g, ' ');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 py-4 border-b border-neutral-100">
      <Avatar initials={initials} size="md" />

      <View className="flex-1">
        <Text className="text-sm font-bold text-neutral-900">{name ?? '—'}</Text>
        <Text className="mt-0.5 text-xs text-neutral-400">{roleLabel}</Text>
        <Text className="mt-0.5 text-xs text-neutral-400">
          {operationsHandled} ops · {revenue}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {emergencyRequestCount > 0 && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="warning-outline" size={14} color="#d97706" />
            <Text className="text-xs font-bold text-warning-600">{emergencyRequestCount}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );
}
