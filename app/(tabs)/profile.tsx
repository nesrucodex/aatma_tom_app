import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button } from '../../components';
import ScreeenHeader from '../../components/shared/ScreeenHeader';
import { ProfileRow } from '../../components/features/profile/ProfileRow';
import { useSignOut } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const signOut = useSignOut();
  const [balanceVisible, setBalanceVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader className="pb-8">
        {/* Avatar + identity */}
        <View className="flex-row items-center gap-3 mb-6">
          <Avatar initials="JS" size="md" bgColor="white" textColor="black" />
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-white">Joshua Smith 👋</Text>
            </View>
            <Text className="text-xs font-semibold text-zinc-400">Operator Manager</Text>
          </View>
        </View>

        {/* Balance section */}
        <View className="items-center gap-2 py-4">
          <Text className="text-sm text-zinc-400">Account balance</Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-4xl font-black text-white tracking-tight">
              {balanceVisible ? '2,580.30 ETB' : '••••••  ETB'}
            </Text>
            <TouchableOpacity
              onPress={() => setBalanceVisible((v) => !v)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons
                name={balanceVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="rgba(255,255,255,0.45)"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm text-zinc-500">Next Billing Date:</Text>
            <Text className="text-sm font-semibold text-zinc-300">2024/05/12</Text>
          </View>
        </View>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>

        {/* Info section */}
        <View className="rounded-2xl bg-neutral-50 overflow-hidden mb-5">
          <ProfileRow label="Station" value="Mexico Station" />
          <ProfileRow label="Phone" value="+251 912 345 678" />
          <ProfileRow label="Joined Date" value="March 15, 2025" />
          <View className="flex-row items-center justify-between px-4 py-3.5">
            <Text className="text-sm text-neutral-500">Language</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-neutral-900">English</Text>
              <Ionicons name="chevron-down" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          label='Sign Out'
          variant={"outline"}
          className='border-destructive mt-6'
          classNames={{
            text: "text-destructive"
          }}
          onPress={signOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
