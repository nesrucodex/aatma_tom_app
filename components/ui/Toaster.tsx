import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../lib/tokens';
import { TOASTER_CONFIG, type ToastItem, type ToastVariant, useToastStore } from '../../lib/toast';

const SCREEN_WIDTH = Dimensions.get('window').width;

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ComponentProps<typeof Ionicons>['name']; iconColor: string; barColor: string; title: string }
> = {
  success: { icon: 'checkmark-circle-outline', iconColor: colors.success.DEFAULT, barColor: colors.success.DEFAULT, title: 'Success' },
  error: { icon: 'close-circle-outline', iconColor: colors.destructive.DEFAULT, barColor: colors.destructive.DEFAULT, title: 'Error' },
  warning: { icon: 'alert-circle-outline', iconColor: colors.warning.DEFAULT, barColor: colors.warning.DEFAULT, title: 'Warning' },
  info: { icon: 'information-circle-outline', iconColor: colors.info.DEFAULT, barColor: colors.info.DEFAULT, title: 'Info' },
};

function ToastCard({ item, index }: { item: ToastItem; index: number }) {
  const remove = useToastStore((s) => s.remove);
  const config = VARIANT_CONFIG[item.variant];
  const displayDuration = item.duration ?? TOASTER_CONFIG.duration[item.variant];

  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0.5, duration: TOASTER_CONFIG.animation.outDuration, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -30, duration: TOASTER_CONFIG.animation.outDuration, useNativeDriver: true }),
    ]).start(() => remove(item.id));
  };

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
      mass: 0.8,
    }).start();

    const t = setTimeout(dismiss, displayDuration);
    return () => clearTimeout(t);
  }, []);

  const offset = TOASTER_CONFIG.position === 'top'
    ? TOASTER_CONFIG.offsetTop + index * 65
    : undefined;
  const bottomOffset = TOASTER_CONFIG.position === 'bottom'
    ? TOASTER_CONFIG.offsetBottom + index * 65
    : undefined;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX }, { translateY }],
        position: 'absolute',
        top: offset,
        bottom: bottomOffset,
        left: 16,
        right: 16,
        zIndex: 999 + index,
      }}>
      <View
        className="flex-row overflow-hidden rounded-none bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 10,
        }}>
        <View style={{ width: 4, backgroundColor: config.barColor }} />

        <View className="items-center justify-center px-3">
          <Ionicons name={config.icon} size={26} color={config.iconColor} />
        </View>

        <View className="flex-1 py-3.5 pr-2">
          <Text className="text-sm font-bold text-gray-900">{config.title}</Text>
          <Text className="mt-0.5 text-xs leading-4 text-gray-500" numberOfLines={2}>
            {item.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismiss}
          className="items-center justify-center px-3"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((item, index) => (
        <ToastCard key={item.id} item={item} index={index} />
      ))}
    </>
  );
}
