import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';
import { Sheet } from './Sheet';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

interface SelectSheetProps<T extends string = string> {
  title?: string;
  subtitle?: string;
  options: SelectOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
  onClose?: () => void;
  snapPoints?: (string | number)[];
}

export const SelectSheet = forwardRef<BottomSheet, SelectSheetProps>(
  ({ title, subtitle, options, selected, onSelect, onClose, snapPoints }, ref) => {
    const handleSelect = (value: string) => {
      onSelect(value as any);
      (ref as React.RefObject<BottomSheet>)?.current?.close();
    };

    return (
      <Sheet
        ref={ref}
        title={title}
        subtitle={subtitle}
        snapPoints={snapPoints ?? [Math.min(options.length * 80 + 160, 480)]}
        onClose={onClose}>
        <View className="gap-2">
          {options.map((opt) => {
            const isSelected = opt.value === selected;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
                className={cn(
                  'flex-row items-center gap-3 rounded-2xl px-4 py-3.5',
                  isSelected ? 'bg-blue-50' : 'bg-gray-50',
                )}>
                {opt.icon && (
                  <View
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-full',
                      isSelected ? 'bg-blue-100' : 'bg-white',
                    )}>
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={isSelected ? '#2563eb' : '#6b7280'}
                    />
                  </View>
                )}

                <View className="flex-1">
                  <Text
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-blue-700' : 'text-gray-900',
                    )}>
                    {opt.label}
                  </Text>
                  {opt.sublabel && (
                    <Text className="mt-0.5 text-xs text-gray-400">{opt.sublabel}</Text>
                  )}
                </View>

                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
                ) : (
                  <View className="h-5 w-5 rounded-full border-2 border-gray-200" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Sheet>
    );
  },
);

SelectSheet.displayName = 'SelectSheet';
