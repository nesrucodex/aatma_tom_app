import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button } from '../../components';
import ScreeenHeader from '../../components/shared/ScreeenHeader';
import { ProfileRow } from '../../components/features/profile/ProfileRow';
import { useSignOut } from '../../hooks/useAuth';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useOperatorDetail } from '../../hooks/useOperatorDetail';

export default function ProfileScreen() {
  const signOut = useSignOut();
  const [balanceVisible, setBalanceVisible] = useState(false);

  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: opDetail, isLoading: opLoading } = useOperatorDetail(user?.id);

  const name = user?.name ?? '—';
  const initials = name.slice(0, 2).toUpperCase();
  const role = user?.role?.replace(/_/g, ' ') ?? '—';
  const phone = user?.phone ?? '—';
  const terminal = user?.terminalOperator?.association?.terminal;
  const association = user?.terminalOperator?.association;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const totalEarning = opDetail?.totalEarning ?? 0;
  const pendingPayment = opDetail?.pendingPayment ?? 0;
  const receivedSalary = opDetail?.receivedSalary ?? 0;

  const isLoading = userLoading;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader className="pb-8">
        {/* Avatar + identity */}
        <View className="flex-row items-center gap-3 mb-6">
          {isLoading ? (
            <View className="h-10 w-10 rounded-full bg-zinc-800" />
          ) : (
            <Avatar initials={initials} size="md" bgColor="white" textColor="black" />
          )}
          <View className="flex-1">
            {isLoading ? (
              <View className="h-4 w-32 rounded bg-zinc-800 mb-1" />
            ) : (
              <Text className="text-sm font-semibold text-white">{name} 👋</Text>
            )}
            <Text className="text-xs font-semibold text-zinc-400">{role}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setBalanceVisible((v) => !v)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="">
            <Ionicons
              name={balanceVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="rgba(255,255,255,0.45)"
            />
          </TouchableOpacity>
          {/* {user?.isActive && (
            <View className="rounded-full bg-success-900/40 px-2.5 py-1">
              <Text className="text-xs font-semibold text-success-400">Active</Text>
            </View>
          )} */}
        </View>

        {/* Balance */}
        <View className="items-center gap-2 py-4">
          <Text className="text-sm text-zinc-400">Account balance</Text>
          <View className="relative">
            <Text className="text-4xl font-black text-white tracking-tight">
              {opLoading || !balanceVisible ? '••••••  ETB' : `${totalEarning.toLocaleString()} ETB`}
            </Text>

          </View>
          {opLoading ? (
            <ActivityIndicator size="small" color="#52525b" />
          ) : (
            <View className="flex-row gap-4 mt-1">
              <View className="items-center">
                <Text className="text-xs text-zinc-500">Received</Text>
                <Text className="text-xs font-semibold text-zinc-300">{!balanceVisible ? '••••••  ETB' : `${receivedSalary.toLocaleString()} ETB`}</Text>
              </View>
              <View className="w-px bg-zinc-800" />
              <View className="items-center">
                <Text className="text-xs text-zinc-500">Pending</Text>
                <Text className="text-xs font-semibold text-warning-400">{!balanceVisible ? '••••••  ETB' : `${pendingPayment.toLocaleString()} ETB`}</Text>
              </View>
            </View>
          )}
        </View>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>

        {/* Personal info */}
        <View className="rounded-2xl bg-neutral-50 overflow-hidden mb-4">
          <ProfileRow label="Phone" value={phone} />
          <ProfileRow label="Role" value={role} />
          <ProfileRow label="Joined" value={joinedDate} />
          <ProfileRow
            label="Status"
            value={user?.isActive ? 'Active' : 'Inactive'}
            valueClassName={user?.isActive ? 'text-success-600' : 'text-destructive'}
          />
        </View>

        {/* Association + terminal */}
        {(association || terminal) && (
          <View className="rounded-2xl bg-neutral-50 overflow-hidden mb-4">
            <Text className="px-4 pt-3.5 pb-1 text-xs font-semibold text-neutral-400 tracking-widest">
              ASSIGNMENT
            </Text>
            {association && <ProfileRow label="Association" value={association.name} />}
            {terminal && <ProfileRow label="Terminal" value={terminal.name} />}
            {terminal?.description && (
              <ProfileRow label="Description" value={terminal.description} multiline />
            )}
            {user?.terminalOperator && (
              <ProfileRow label="Operator Status" value={user.terminalOperator.status} />
            )}
          </View>
        )}

        {/* Bank info */}
        {user?.terminalOperator && (
          <View className="rounded-2xl bg-neutral-50 overflow-hidden mb-4">
            <Text className="px-4 pt-3.5 pb-1 text-xs font-semibold text-neutral-400 tracking-widest">
              BANK
            </Text>
            <ProfileRow label="Bank" value={user.terminalOperator.bankName} />
            <ProfileRow label="Account" value={user.terminalOperator.bankAccountNumber} />
          </View>
        )}

        <Button
          label="Sign Out"
          variant="outline"
          size="md"
          className="border-destructive mt-2"
          classNames={{ text: 'text-destructive' }}
          onPress={signOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
