import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '../../../components';

interface OperatorRowProps {
  initials: string;
  name: string;
  station: string;
  revenue: string;
  checkedIn: string;
  time: string;
  issueCount?: number;
  onPress?: () => void;
}

export function OperatorRow({
  initials,
  name,
  station,
  revenue,
  checkedIn,
  time,
  issueCount,
  onPress,
}: OperatorRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 py-4 border-b border-neutral-100">
      <Avatar initials={initials} size="lg" />

      <View className="flex-1">
        <Text className="text-lg font-bold text-neutral-900">{name}</Text>
        <Text className="mt-0.5 text-sm text-neutral-400">{station} · {revenue}</Text>
        <Text className="mt-0.5 text-sm text-neutral-400">
          Checked in <Text className="font-medium text-neutral-600">{checkedIn}</Text> at {time}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {issueCount ? (
          <View className=" flex flex-row gap-1 items-center justify-center rounded-full">
            <Ionicons name='warning-outline' color={"#f59e0b"} />
            <Text className="text-xs font-bold text-warning-500">{issueCount}</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );
}
