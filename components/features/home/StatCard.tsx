import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

type StatCardItem = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  value: string;
  label: string;
};

interface StatCardsProps {
  items: StatCardItem[];
}

export function StatCards({ items }: StatCardsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
    >
      {items.map((item, i) => (
        <View
          key={i}
          className="w-44 rounded-2xl bg-blue-200/10 p-4 "
          style={{ minWidth: 160 }}>
          <Ionicons name={item.icon} size={24} color={item.iconColor} />
          <Text className="mt-3 text-2xl font-bold text-white">{item.value}</Text>
          <Text className="mt-0.5 text-xs text-gray-400">{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
