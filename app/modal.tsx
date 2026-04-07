import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function Modal() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold text-gray-900">Modal</Text>
      <StatusBar style="light" />
    </View>
  );
}
