import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '../../lib/utils';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface DrawerOption<T extends string = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

interface BottomDrawerProps<T extends string = string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: DrawerOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}

export function BottomDrawer<T extends string>({
  visible,
  onClose,
  title,
  subtitle,
  options,
  selected,
  onSelect,
}: BottomDrawerProps<T>) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 200,
          mass: 0.9,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{ opacity: backdropOpacity }}
          className="absolute inset-0 bg-black/50"
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white"
        >
        {/* Handle */}
        <View className="items-center pt-3 pb-1">
          <View className="h-1 w-10 rounded-full bg-gray-200" />
        </View>

        {/* Header */}
        <View className="flex-row items-start justify-between px-5 pt-3 pb-4">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>
            {subtitle ? (
              <Text className="mt-0.5 text-sm text-gray-400">{subtitle}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}>
          {options.map((opt, i) => {
            const isSelected = opt.value === selected;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
                className={cn(
                  'flex-row items-center gap-4 rounded-2xl px-4 py-3.5 mb-2',
                  isSelected ? 'bg-blue-50' : 'bg-gray-50',
                )}>
                {/* Icon bubble */}
                {opt.icon ? (
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
                ) : null}

                {/* Text */}
                <View className="flex-1">
                  <Text
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-blue-700' : 'text-gray-900',
                    )}>
                    {opt.label}
                  </Text>
                  {opt.sublabel ? (
                    <Text className="mt-0.5 text-xs text-gray-400">{opt.sublabel}</Text>
                  ) : null}
                </View>

                {/* Check */}
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
                ) : (
                  <View className="h-5 w-5 rounded-full border-2 border-gray-200" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
