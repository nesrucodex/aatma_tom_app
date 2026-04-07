import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

import { Badge } from '../../ui/Badge';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export type VehicleStatus = 'checked-out' | 'checked-in' | 'conflict';

interface TimelineItem {
  label: string;
  time: string;
  station: string;
}

interface VehicleCardProps {
  plate: string;
  status: VehicleStatus;
  station: string;
  operator: string;
  duration: string;
  timeline: TimelineItem[];
  conflictStation?: string;
  onAction: () => void;
  onViewDetail: () => void;
}

const STATUS_CONFIG: Record<
  VehicleStatus,
  { badgeVariant: 'success' | 'warning' | 'danger' | 'default'; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  'checked-out': { badgeVariant: 'success', label: 'Checked Out', icon: 'checkmark-circle' },
  'checked-in':  { badgeVariant: 'default', label: 'Checked In',  icon: 'radio-button-on'  },
  'conflict':    { badgeVariant: 'warning', label: 'Conflict',    icon: 'warning'           },
};

export function VehicleCard({
  plate,
  status,
  station,
  operator,
  duration,
  timeline,
  conflictStation,
  onAction,
  onViewDetail,
}: VehicleCardProps) {
  const [timelineOpen, setTimelineOpen] = useState(true);
  const rotation = useRef(new Animated.Value(1)).current;
  const cfg = STATUS_CONFIG[status];

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 240,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut', property: 'scaleY' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    Animated.timing(rotation, {
      toValue: timelineOpen ? 0 : 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
    setTimelineOpen((p) => !p);
  };

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '0deg'] });

  const isConflict = status === 'conflict';

  return (
    <View
      className="rounded-3xl bg-white p-5 gap-4 mb-4"
      style={{
        borderWidth: 1,
        borderColor: isConflict ? '#fde68a' : 'rgba(0,0,0,0.07)',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}>

      {/* Plate + badge */}
      <View className="flex-row items-center justify-between">
        <Text className="text-3xl font-black text-neutral-900">{plate}</Text>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name={cfg.icon} size={14} color={isConflict ? '#d97706' : '#16a34a'} />
          <Badge label={cfg.label} variant={cfg.badgeVariant} />
        </View>
      </View>

      {/* Info row */}
      <View className="flex-row gap-6">
        {[
          { label: 'Station',  value: station  },
          { label: 'Operator', value: operator },
          { label: 'Time',     value: duration },
        ].map((item) => (
          <View key={item.label}>
            <Text className="text-xs text-neutral-400">{item.label}</Text>
            <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Conflict warning banner */}
      {isConflict && conflictStation && (
        <View className="rounded-xl bg-warning-50 border border-warning-200 p-3 gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning" size={14} color="#d97706" />
            <Text className="text-sm font-bold text-warning-700">
              Active at {conflictStation}
            </Text>
          </View>
          <Text className="text-xs text-warning-600">
            This vehicle is checked in at another station. Resolve to continue.
          </Text>
        </View>
      )}

      <View className="h-px bg-neutral-100" />

      {/* Collapsible timeline */}
      <View>
        <TouchableOpacity
          onPress={toggle}
          activeOpacity={0.7}
          className="flex-row items-center gap-2">
          <Ionicons name="receipt-outline" size={14} color="#9ca3af" />
          <Text className="flex-1 text-xs font-semibold text-neutral-500">Activity Timeline</Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-up" size={14} color="#9ca3af" />
          </Animated.View>
        </TouchableOpacity>

        {timelineOpen && (
          <View className="mt-3 gap-3">
            {timeline.map((item, i) => (
              <View key={i} className="flex-row items-start gap-3">
                <View className="mt-1.5 h-2 w-2 rounded-full bg-neutral-300" />
                <View>
                  <Text className="text-sm font-semibold text-neutral-800">{item.label}</Text>
                  <Text className="text-xs text-neutral-400">{item.time} · {item.station}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="gap-2.5 mt-1">
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.85}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${
            isConflict ? 'bg-primary' : 'bg-success'
          }`}>
          <Ionicons
            name={isConflict ? 'flash' : 'checkmark-circle-outline'}
            size={20}
            color="white"
          />
          <Text className="text-base font-bold text-white">
            {isConflict ? 'Resolve & Check-in' : 'Check-in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onViewDetail}
          activeOpacity={0.7}
          className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200">
          <Ionicons name="document-text-outline" size={16} color="#6b7280" />
          <Text className="text-sm font-semibold text-neutral-600">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
