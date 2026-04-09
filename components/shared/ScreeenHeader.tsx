import { Ionicons } from '@expo/vector-icons';
import { ClassValue } from 'clsx';
import React, { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

type Props = PropsWithChildren & {
  className?: ClassValue;
  onBack?: () => void;
  backLabel?: string;
  classNames?: {
    terminalRoot?: ClassValue,
    associationRoot?: ClassValue,
    terminalAssociationRoot?: ClassValue
  }
};

const ScreeenHeader = ({ children, className, classNames, onBack, backLabel = 'Back' }: Props) => {
  const { data: userDetail } = useCurrentUser();
  const terminalName = userDetail?.terminalOperator?.association?.terminal?.name;
  const associationName = userDetail?.terminalOperator?.association?.name;

  return (
    <View className={cn('bg-zinc-950 px-5 pb-5 pt-8 relative rounded-b-2xl', className)}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 16,
      }}
    >
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

      {(terminalName || associationName) && (
        <View className={cn("flex-row items-center gap-3 mt-4 pt-3 border-t border-zinc-800", classNames?.terminalAssociationRoot)}>
          {terminalName && (
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="location-outline" size={12} color="#52525b" />
              <Text className="text-xs text-zinc-500">{terminalName}</Text>
            </View>
          )}
          {associationName && (
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="people-outline" size={12} color="#52525b" />
              <Text className="text-xs text-zinc-500">{associationName}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ScreeenHeader;
