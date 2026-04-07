import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Badge, Button, Card } from '../../../components';

interface TimelineItem {
  time: string;
  label: string;
}

interface VehicleDetailProps {
  plate: string;
  status: 'checked-in' | 'checked-out';
  station: string;
  operator: string;
  timeAgo: string;
  timeline: TimelineItem[];
  onCheckIn?: () => void;
}

export function VehicleDetail({
  plate,
  status,
  station,
  operator,
  timeAgo,
  timeline,
  onCheckIn,
}: VehicleDetailProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">{plate}</Text>
        <Badge
          label={status === 'checked-out' ? 'Checked Out' : 'Checked In'}
          variant={status === 'checked-out' ? 'danger' : 'success'}
        />
      </View>

      <Card variant="dark" padding="md" className="gap-2">
        <View className="flex-row gap-6">
          <View>
            <Text className="text-xs text-gray-400">Status</Text>
            <Text className="text-sm font-semibold text-white">{station}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400">Operator</Text>
            <Text className="text-sm font-semibold text-white">{operator}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400">Time</Text>
            <Text className="text-sm font-semibold text-white">{timeAgo}</Text>
          </View>
        </View>
      </Card>

      <View>
        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="time-outline" size={14} color="#9ca3af" />
          <Text className="text-xs text-gray-400">Activity Timeline</Text>
        </View>
        {timeline.map((item, i) => (
          <View key={i} className="flex-row gap-2 py-1">
            <Text className="text-xs text-gray-400 w-16">{item.time}</Text>
            <Text className="text-xs text-gray-300">{item.label}</Text>
          </View>
        ))}
      </View>

      <Button
        label="Check-in"
        variant="default"
        className="w-full bg-green-500 active:bg-green-600"
        leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color="white" />}
        onPress={onCheckIn}
      />
    </View>
  );
}
