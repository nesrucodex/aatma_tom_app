import { Tabs } from 'expo-router';

import { TabBar } from '../../components/ui/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="operators" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
