import { Text, View } from 'react-native';

export interface TimelineItem {
  id?: string;
  label: string;
  sublabel?: string;
  date?: string;
  dotColor?: string; // tailwind bg class e.g. 'bg-primary', 'bg-neutral-300'
}

interface TimelineProps {
  items: TimelineItem[];
  emptyText?: string;
  /** Show connector lines between dots (default true) */
  showLines?: boolean;
}

export function Timeline({ items, emptyText = 'No activity recorded', showLines = true }: TimelineProps) {
  if (items.length === 0) {
    return <Text className="text-xs text-neutral-400">{emptyText}</Text>;
  }

  return (
    <View>
      {items.map((item, i) => (
        <View key={item.id ?? i} className="flex-row items-start gap-3">
          {/* Dot + connector */}
          <View className="items-center" style={{ width: 10 }}>
            <View className={`h-2.5 w-2.5 rounded-full mt-1.5 ${item.dotColor ?? (i === 0 ? 'bg-primary' : 'bg-neutral-300')}`} />
            {showLines && i < items.length - 1 && (
              <View className="w-px flex-1 bg-neutral-200 mt-1" style={{ minHeight: 20 }} />
            )}
          </View>

          {/* Content */}
          <View className="flex-1 pb-3">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="text-sm font-semibold text-neutral-900 flex-1">{item.label}</Text>
              {item.date && (
                <Text className="text-xs text-neutral-400 shrink-0">{item.date}</Text>
              )}
            </View>
            {item.sublabel && (
              <Text className="text-xs text-neutral-400 mt-0.5">{item.sublabel}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
