import { Text, View } from 'react-native';

interface ActivityRowProps {
  plate: string;
  operator: string;
  time: string;
  status: 'checked-in' | 'checked-out';
  station: string;
}

export function ActivityRow({ plate, operator, time, status, station }: ActivityRowProps) {
  const isCheckedIn = status === 'checked-in';

  return (
    <View className="flex-row items-center justify-between rounded-md bg-neutral-50 px-4 py-4 mb-2.5">
      <View className="flex-1">
        <Text className="text-base font-bold text-neutral-900">{plate}</Text>
        <Text className="mt-1 text-sm text-neutral-400">
          Operator <Text className="font-semibold text-neutral-600">{operator}</Text>
        </Text>
      </View>

      <View className="items-end gap-1">
        <Text className={`text-sm font-bold ${isCheckedIn ? 'text-success-600' : 'text-destructive-500'}`}>
          {isCheckedIn ? 'Checked in' : 'Checked out'}
        </Text>
        <Text className="text-xs text-neutral-400">{time} · {station}</Text>
      </View>
    </View>
  );
}
