import { Text, View } from 'react-native';

interface ProfileRowProps {
  label: string;
  value: string;
  valueClassName?: string;
  multiline?: boolean;
}

export function ProfileRow({ label, value, valueClassName, multiline }: ProfileRowProps) {
  if (multiline) {
    return (
      <View className="px-4 py-3.5 border-b border-neutral-100 gap-1">
        <Text className="text-sm text-neutral-500">{label}</Text>
        <Text className={`text-sm font-semibold text-neutral-900 leading-5 ${valueClassName ?? ''}`}>
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-neutral-100">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className={`text-sm font-semibold text-neutral-900 ml-4 text-right flex-shrink ${valueClassName ?? ''}`} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
