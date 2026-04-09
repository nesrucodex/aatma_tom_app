import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';


interface CollapsibleProps {
  title: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function Collapsible({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
  className,
  titleClassName,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut', property: 'scaleY' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    Animated.timing(rotation, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setOpen((p) => !p);
  };

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View className={cn('gap-0', className)}>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        className="flex-row items-center gap-2">
        {icon && <Ionicons name={icon} size={15} color="#6b7280" />}
        <Text className={cn('flex-1 text-sm font-bold text-neutral-700', titleClassName)}>
          {title}
        </Text>
        {badge !== undefined && (
          <View className="rounded-full bg-neutral-200 px-2 py-0.5 mr-1">
            <Text className="text-xs font-bold text-neutral-600">{badge}</Text>
          </View>
        )}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color="#9ca3af" />
        </Animated.View>
      </TouchableOpacity>

      {open && <View className="mt-3 ml-1">{children}</View>}
    </View>
  );
}
