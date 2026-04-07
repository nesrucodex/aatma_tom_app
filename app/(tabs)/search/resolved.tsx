import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../components';

export default function ResolvedScreen() {
  const router = useRouter();
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setResolving(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (resolving) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center gap-4">
        <ActivityIndicator size={70} color="#2563eb" />
        <View className='flex gap-2'>
          <Text className="text-base font-semibold text-gray-900">Resolving conflict...</Text>
          <Text className="text-sm text-gray-400">Checking out from Kazanchis</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-8 gap-4">
      <View className="h-24 w-24 rounded-full bg-green-100 items-center justify-center mb-2">
        <Ionicons name="checkmark-circle-outline" size={48} color="#16a34a" />
      </View>

      <Text className="text-2xl font-bold text-gray-900">Resolved</Text>
      <Text className="text-sm text-gray-500 text-center">
        AA-51678 has been checked out from Kazanchis and checked in at Mexico.
      </Text>
      <Text className="text-sm  text-green-500">Conflict cleared successfully</Text>

      <Button
        label="Back to Search"
        className="w-full mt-4"
        onPress={() => router.replace('/(tabs)/search')}
      />
      <Button
        label="Go Home"
        variant="ghost"
        size="md"
        onPress={() => router.replace('/(tabs)')}
      />
    </SafeAreaView>
  );
}
