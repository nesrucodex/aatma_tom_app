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

import { Alert } from '../../ui/Alert';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export type VehicleStatus = 'checked-out' | 'checked-in' | 'conflict';

export interface TimelineItem {
  label: string;
  time: string;
  station: string;
}

export interface VehicleCardProps {
  plate: string;
  status: VehicleStatus;
  station: string;
  operator: string;
  duration: string;
  route?: string | null;
  timeline: TimelineItem[];
  conflictStation?: string;
  loading?: boolean;
  onAction: () => void;
  onViewDetail: () => void;
}

const STATUS_CONFIG: Record<
  VehicleStatus,
  { badgeVariant: 'success' | 'warning' | 'danger' | 'default'; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  'checked-out': { badgeVariant: 'success', label: 'Checked Out', icon: 'checkmark-circle'  },
  'checked-in':  { badgeVariant: 'default', label: 'Checked In',  icon: 'radio-button-on'   },
  'conflict':    { badgeVariant: 'warning', label: 'Conflict',    icon: 'warning'            },
};

function Skeleton({ className }: { className?: string }) {
  return <View className={`rounded-lg bg-neutral-100 ${className ?? ''}`} />;
}

export function VehicleCard({
  plate,
  status,
  station,
  operator,
  duration,
  route,
  timeline,
  conflictStation,
  loading = false,
  onAction,
  onViewDetail,
}: VehicleCardProps) {
  const [timelineOpen, setTimelineOpen] = useState(true);
  const rotation = useRef(new Animated.Value(1)).current;
  const cfg = STATUS_CONFIG[status];
  const isConflict = status === 'conflict';

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

  return (
    <View className="rounded-3xl bg-white border border-neutral-200/80 p-5 gap-4 mb-4">

      {/* Plate + badge */}
      <View className="flex-row items-center justify-between">
        {loading ? <Skeleton className="h-8 w-36" /> : (
          <Text className="text-3xl font-black text-neutral-900">{plate}</Text>
        )}
        {loading ? <Skeleton className="h-6 w-24" /> : (
          <View className="flex-row items-center gap-1.5">
            <Ionicons name={cfg.icon} size={14} color={isConflict ? '#d97706' : '#16a34a'} />
            <Badge label={cfg.label} variant={cfg.badgeVariant} />
          </View>
        )}
      </View>

      {/* Info row */}
      {loading ? (
        <View className="flex-row gap-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-16" />
        </View>
      ) : (
        <View className="flex-row gap-6 flex-wrap">
          {[
            { label: 'Station',  value: station   },
            { label: 'Operator', value: operator  },
            { label: 'Time',     value: duration  },
          ].map((item) => (
            <View key={item.label}>
              <Text className="text-xs text-neutral-400">{item.label}</Text>
              <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Route */}
      {!loading && (
        <View className="flex-row items-center gap-1.5">
          <Ionicons
            name="map-outline"
            size={13}
            color={route ? '#2563eb' : '#9ca3af'}
          />
          <Text className={`text-xs font-medium ${route ? 'text-primary' : 'text-neutral-400'}`}>
            {route ?? 'No route assigned'}
          </Text>
        </View>
      )}

      {/* Conflict warning */}
      {!loading && isConflict && conflictStation && (
        <Alert
          title={`Active at ${conflictStation}`}
          description="This vehicle is checked in at another station. Resolve to continue."
        />
      )}

      <View className="h-px bg-neutral-100" />

      {/* Collapsible timeline */}
      {loading ? (
        <View className="gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </View>
      ) : (
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
      )}

      {/* Actions */}
      <View className="gap-2.5 mt-1">
        <Button
          label={isConflict ? 'Resolve & Check-in' : 'Check-in'}
          variant="default"
          size="lg"
          disabled={loading}
          className="w-full"
          leftIcon={
            <Ionicons
              name={isConflict ? 'flash' : 'checkmark-circle-outline'}
              size={20}
              color="white"
            />
          }
          onPress={onAction}
        />

        <Button
          label="View Details"
          variant="outline"
          size="md"
          disabled={loading}
          className="w-full"
          leftIcon={
            <Ionicons name="document-text-outline" size={16} color="#1d4ed8" />
          }
          onPress={onViewDetail}
        />
      </View>
    </View>
  );
}
