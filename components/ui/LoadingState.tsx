import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color="#1d4ed8" />
      {message && <Text className="text-sm text-gray-400">{message}</Text>}
    </View>
  );
}
