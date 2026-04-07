import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabIcons } from '../../assets';

type TabConfig = {
  name: string;
  label: string;
  Icon: React.FC<{ color: string; width: number; height: number }>;
};

const TAB_CONFIG: TabConfig[] = [
  { name: 'index',     label: 'Home',      Icon: tabIcons.HomeIcon      },
  { name: 'search',    label: 'Search',    Icon: tabIcons.SearchIcon    },
  { name: 'operators', label: 'Operators', Icon: tabIcons.OperatorsIcon },
  { name: 'profile',   label: 'Profile',   Icon: tabIcons.ProfileIcon   },
];

const ACTIVE_COLOR   = '#111827'; // near-black
const INACTIVE_COLOR = '#9ca3af';

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 16,
      }}>
      <View className="flex-row items-center justify-around px-2 pt-3 pb-1">
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG.find((t) => t.name === route.name);
          if (!config) return null;

          const focused = state.index === index;
          const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              className="flex-1 items-center gap-1 py-1">
              <View className="h-8 w-8 items-center justify-center">
                <config.Icon
                  color={color}
                  width={24}
                  height={24}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: focused ? '#111827' : INACTIVE_COLOR,
                  fontWeight: focused ? '700' : '400',
                }}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
