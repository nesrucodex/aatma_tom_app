import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';

// Config — tweak durations here globally
export const TOAST_CONFIG = {
  duration: {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000,
  },
  animation: {
    inDuration: 350,
    outDuration: 300,
  },
} as const;

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

const SCREEN_WIDTH = Dimensions.get('window').width;

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    barColor: string;
    title: string;
  }
> = {
  success: {
    icon: 'checkmark-circle-outline',
    iconColor: '#16a34a',
    barColor: '#16a34a',
    title: 'Success',
  },
  error: {
    icon: 'close-circle-outline',
    iconColor: '#dc2626',
    barColor: '#dc2626',
    title: 'Error',
  },
  warning: {
    icon: 'alert-circle-outline',
    iconColor: '#d97706',
    barColor: '#d97706',
    title: 'Warning',
  },
  info: {
    icon: 'information-circle-outline',
    iconColor: '#2563eb',
    barColor: '#2563eb',
    title: 'Info',
  },
};

interface ToastProps {
  message: string;
  visible: boolean;
  variant?: ToastVariant;
  onHide?: () => void;
  duration?: number;
}

export function Toast({ message, visible, variant = 'info', onHide, duration }: ToastProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const config = VARIANT_CONFIG[variant];
  const displayDuration = duration ?? TOAST_CONFIG.duration[variant];

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: TOAST_CONFIG.animation.outDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: TOAST_CONFIG.animation.outDuration,
        useNativeDriver: true,
      }),
    ]).start(() => onHide?.());
  };

  useEffect(() => {
    if (!visible) return;

    // Reset values
    translateX.setValue(SCREEN_WIDTH);
    translateY.setValue(0);
    opacity.setValue(1);

    // Slide in from right
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
      mass: 0.8,
    }).start();

    const t = setTimeout(dismiss, displayDuration);
    return () => clearTimeout(t);
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX }, { translateY }],
        position: 'absolute',
        top: 52,
        left: 16,
        right: 16,
        zIndex: 999,
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
        {/* Left accent bar */}
        <View style={{ width: 4, backgroundColor: config.barColor }} />

        {/* Icon */}
        <View className="items-center justify-center px-3">
          <Ionicons name={config.icon} size={26} color={config.iconColor} />
        </View>

        {/* Text */}
        <View className="flex-1 py-3.5 pr-2">
          <Text className="text-sm font-bold text-gray-900">{config.title}</Text>
          <Text className="mt-0.5 text-xs leading-4 text-gray-500" numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* Dismiss */}
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
