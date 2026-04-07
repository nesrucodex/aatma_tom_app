import { Ionicons } from '@expo/vector-icons';
import { ClassValue } from 'clsx';
import React, { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';

type Props = PropsWithChildren & {
  className?: ClassValue;
  onBack?: () => void;
  backLabel?: string;
};

const ScreeenHeader = ({ children, className, onBack, backLabel = 'Back' }: Props) => {
  return (
    <View className={cn('bg-zinc-950 px-5 pb-8 pt-8 relative rounded-b-2xl', className)}>
      <View className="absolute -top-10 inset-0 h-20 bg-zinc-950 -z-[99]" />
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 mb-3 self-start">
          <Ionicons name="chevron-back" size={18} color="#9ca3af" />
          <Text className="text-sm text-gray-400">{backLabel}</Text>
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};

export default ScreeenHeader;
