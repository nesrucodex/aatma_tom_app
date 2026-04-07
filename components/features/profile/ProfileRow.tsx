import { Text, View } from 'react-native';

interface ProfileRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export function ProfileRow({ label, value, valueClassName }: ProfileRowProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-neutral-100">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className={`text-sm font-semibold text-neutral-900 ${valueClassName ?? ''}`}>{value}</Text>
    </View>
  );
}
