import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TimelineItem {
  time: string;
  station: string;
  active?: boolean;
}

interface ConflictCardProps {
  plate: string;
  station: string;
  operator: string;
  duration: string;
  timeline: TimelineItem[];
  onResolve?: () => void;
  onViewDetails?: () => void;
}

export function ConflictCard({
  plate,
  station,
  operator,
  duration,
  timeline,
  onResolve,
  onViewDetails,
}: ConflictCardProps) {
  return (
    <View className="gap-3 pb-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">{plate}</Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="warning-outline" size={14} color="#f59e0b" />
          <Text className="text-sm font-semibold text-yellow-400">Conflict</Text>
        </View>
      </View>

      <View className="flex-row gap-4">
        <View>
          <Text className="text-xs text-gray-400">Station</Text>
          <Text className="text-sm font-semibold text-white">{station}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-400">Operator</Text>
          <Text className="text-sm font-semibold text-white">{operator}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-400">Time</Text>
          <Text className="text-sm font-semibold text-white">{duration}</Text>
        </View>
      </View>

      <Card variant="warning" padding="md" className="gap-1">
        <View className="flex-row items-center gap-2">
          <Ionicons name="warning-outline" size={14} color="#d97706" />
          <Text className="text-sm font-semibold text-yellow-700">Active at Kazanchis Station</Text>
        </View>
        <Text className="text-xs text-yellow-600">
          This vehicle is checked in at another station. Resolve to continue.
        </Text>
      </Card>

      <View className="gap-1">
        <View className="flex-row items-center gap-1 mb-1">
          <Ionicons name="time-outline" size={13} color="#9ca3af" />
          <Text className="text-xs text-gray-400">Activity Timeline</Text>
        </View>
        {timeline.map((item, i) => (
          <View key={i} className="flex-row items-start gap-2 py-1">
            <View
              className={`mt-1.5 h-2 w-2 rounded-full ${item.active ? 'bg-blue-500' : 'bg-gray-500'}`}
            />
            <View>
              <Text className="text-sm font-semibold text-white">Checked in</Text>
              <Text className="text-xs text-gray-400">{item.time} · {item.station}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button
        label="Resolve & Check-in"
        className="w-full"
        leftIcon={<Ionicons name="flash-outline" size={16} color="white" />}
        onPress={onResolve}
      />
      <Button
        label="View Details"
        variant="ghost"
        size="md"
        className="w-full"
        onPress={onViewDetails}
      />
    </View>
  );
}
