import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
}

export interface EmptyStateClassNames {
  root?: string;
  icon?: string;
  title?: string;
  description?: string;
  actions?: string;
  action?: string;
  actionText?: string;
}

export interface EmptyStateProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title?: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
  classNames?: EmptyStateClassNames;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title = 'Nothing here yet',
  description,
  actions,
  className,
  classNames = {},
}: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center py-12 px-6', className, classNames.root)}>
      {/* Icon */}
      <View className={cn('h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4', classNames.icon)}>
        <Ionicons name={icon} size={32} color="#9ca3af" />
      </View>

      {/* Title */}
      {title && (
        <Text className={cn('text-base font-bold text-neutral-700 text-center', classNames.title)}>
          {title}
        </Text>
      )}

      {/* Description */}
      {description && (
        <Text className={cn('mt-1.5 text-sm text-neutral-400 text-center leading-5', classNames.description)}>
          {description}
        </Text>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <View className={cn('mt-5 flex-row gap-3', classNames.actions)}>
          {actions.map((action, i) => {
            const isPrimary = action.variant !== 'outline';
            return (
              <TouchableOpacity
                key={i}
                onPress={action.onPress}
                activeOpacity={0.8}
                className={cn(
                  'rounded-xl px-5 py-2.5',
                  isPrimary ? 'bg-primary' : 'border border-neutral-200 bg-white',
                  classNames.action,
                )}>
                <Text
                  className={cn(
                    'text-sm font-semibold',
                    isPrimary ? 'text-white' : 'text-neutral-700',
                    classNames.actionText,
                  )}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
