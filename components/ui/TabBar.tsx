import { Ionicons } from '@expo/vector-icons';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabConfig = {
    name: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    activeIcon: React.ComponentProps<typeof Ionicons>['name'];
};

const TAB_CONFIG: TabConfig[] = [
    { name: 'index', label: 'Home', icon: 'home', activeIcon: 'home' },
    { name: 'search', label: 'Search', icon: 'search', activeIcon: 'search' },
    { name: 'operators', label: 'Operators', icon: 'people', activeIcon: 'people' },
    { name: 'profile', label: 'Profile', icon: 'person', activeIcon: 'person' },
];

const ACTIVE_COLOR = '#1a0a3c';
const INACTIVE_COLOR = '#9ca3af';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
                shadowOpacity: 0.08,
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
                            <View
                                style={{
                                    width: 44,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Ionicons
                                    name={focused ? config.activeIcon : config.icon}
                                    size={22}
                                    color={focused ? 'black' : INACTIVE_COLOR}
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
