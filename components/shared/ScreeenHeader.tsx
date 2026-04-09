import { Ionicons } from '@expo/vector-icons';
import { ClassValue } from 'clsx';
import React, { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { QueryKey } from '@/config/query-keys.config';
import { RefreshButton } from '@/components/ui/RefreshButton';

type Props = PropsWithChildren & {
  className?: ClassValue;
  onBack?: () => void;
  backLabel?: string;
  queryKeys?: QueryKey[];
  isFetching?: boolean;
  classNames?: {
    terminalRoot?: ClassValue;
    associationRoot?: ClassValue;
    terminalAssociationRoot?: ClassValue;
  };
};

const ScreeenHeader = ({ children, className, classNames, onBack, backLabel = 'Back', queryKeys, isFetching = false }: Props) => {
  const { data: userDetail } = useCurrentUser();
  const queryClient = useQueryClient();
  const terminalName = userDetail?.terminalOperator?.association?.terminal?.name;
  const associationName = userDetail?.terminalOperator?.association?.name;

  const handleRefresh = () => {
    queryKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
  };

  return (
    <View
      className={cn('bg-zinc-950 px-5 pb-5 pt-8 relative rounded-b-2xl', className)}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="absolute -top-10 inset-0 h-20 bg-zinc-950 -z-[99]" />

      {queryKeys?.length ? (
        <RefreshButton
          onRefresh={handleRefresh}
          isFetching={isFetching}
          style={{ position: 'absolute', top: 36, right: 20, zIndex: 10 }}
        />
      ) : null}

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
        <View className={cn('flex-row items-center gap-3 mt-4 pt-3 border-t border-zinc-800', classNames?.terminalAssociationRoot)}>
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
