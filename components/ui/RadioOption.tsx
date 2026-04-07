import { Ionicons } from '@expo/vector-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';

const radioOptionVariants = cva('flex-row items-center justify-between rounded-2xl border p-4', {
  variants: {
    selected: {
      true: 'border-blue-600 bg-blue-50',
      false: 'border-gray-200 bg-white',
    },
  },
  defaultVariants: { selected: false },
});

interface RadioOptionProps extends VariantProps<typeof radioOptionVariants> {
  label: string;
  sublabel?: string;
  onPress?: () => void;
  className?: string;
}

export function RadioOption({ label, sublabel, selected, onPress, className }: RadioOptionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={cn(radioOptionVariants({ selected }), className)}>
      <View className="flex-row items-center gap-3">
        <View
          className={cn(
            'h-5 w-5 rounded-full border-2 items-center justify-center',
            selected ? 'border-blue-600' : 'border-gray-300'
          )}>
          {selected ? <View className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
        </View>
        <View>
          <Text className={cn('text-sm font-semibold', selected ? 'text-blue-700' : 'text-gray-900')}>
            {label}
          </Text>
          {sublabel ? <Text className="text-xs text-gray-400">{sublabel}</Text> : null}
        </View>
      </View>
      <Ionicons name="location-outline" size={16} color={selected ? '#2563eb' : '#9ca3af'} />
    </TouchableOpacity>
  );
}
