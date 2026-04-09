import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="vehicle" />
      <Stack.Screen name="resolve" />
      <Stack.Screen name="pending" />
      <Stack.Screen name="resolved" />
    </Stack>
  );
}
