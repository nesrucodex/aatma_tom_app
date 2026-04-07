import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <Ionicons name="alert-circle-outline" size={36} color="#dc2626" />
      </View>
      <Text className="text-center text-base font-semibold text-gray-900">Oops!</Text>
      <Text className="text-center text-sm text-gray-500">{message}</Text>
      {onRetry && (
        <Button label="Try Again" variant="outline" size="md" onPress={onRetry} />
      )}
    </View>
  );
}
