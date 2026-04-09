import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../components';

export default function ResolvedScreen() {
  const router = useRouter();
  const confettiRef = useRef<any>(null);
  const { plate, fromTerminal, toTerminal } =
    useLocalSearchParams<{ plate: string; fromTerminal: string; toTerminal: string }>();

  const from = fromTerminal || 'previous terminal';
  const to = toTerminal || 'your terminal';

  useEffect(() => {
    confettiRef.current?.start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-8 gap-4">
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
      />

      <View className="h-24 w-24 rounded-full bg-green-100 items-center justify-center mb-2">
        <Ionicons name="checkmark-circle-outline" size={48} color="#16a34a" />
      </View>

      <Text className="text-2xl font-bold text-gray-900">Resolved</Text>
      <Text className="text-sm text-gray-500 text-center px-4">
        {plate} has been checked out from {from} and checked in at {to}.
      </Text>
      <Text className="text-sm text-green-500">Conflict cleared successfully</Text>

      <Button
        label="Back to Search"
        className="w-full mt-6"
        onPress={() => router.replace('/(tabs)/search')}
      />
      <Button
        label="Go Home"
        variant="outline"
        size="md"
        className="w-full"
        onPress={() => router.replace('/(tabs)')}
      />
    </SafeAreaView>
  );
}
