import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Avatar, EmptyState } from '../../components';
import ScreeenHeader from '../../components/shared/ScreeenHeader';
// import { OperatorDetail } from '../../components/features/operators/OperatorDetail';
import { OperatorRow } from '../../components/features/operators/OperatorRow';
import { useAssociationAnalytics } from '../../hooks/useHomeData';
import { useOperatorDetail } from '../../hooks/useOperatorDetail';
import type { AssociationAnalytics } from '../../types/association.types';
import { OperatorDetail } from '@/components/features/operators/OperatorDetail';
import { QUERY_KEYS } from '@/config/query-keys.config';
import { debug } from '@/lib/debug';

type OperatorPerf = AssociationAnalytics['operatorsPerformance'][number];

function OperatorDetailScreen({
  op,
  onBack,
}: {
  op: OperatorPerf;
  onBack: () => void;
}) {
  const { data: detail, isLoading } = useOperatorDetail(op.terminalOperator.id);

  debug.log("OperatorDetailScreen", { op, detail })

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader onBack={onBack} backLabel="Operators" queryKeys={[QUERY_KEYS.OPERATOR_DETAIL]} isFetching={isLoading}>
        <View className="flex-row items-center gap-3">
          <Avatar initials={(op.terminalOperator.name ?? '?').slice(0, 2).toUpperCase()} size="md" />
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">{op.terminalOperator.name ?? '—'}</Text>
            <Text className="text-xs text-zinc-400">{op.terminalOperator.role?.replace(/_/g, ' ')}</Text>
          </View>
        </View>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <OperatorDetail
          operationsHandled={op.operationsHandled}
          revenueGenerated={op.revenueGenerated}
          emergencyRequestCount={op.emergencyRequestCount}
          detail={detail}
          isLoadingDetail={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function OperatorsScreen() {
  const [selectedOp, setSelectedOp] = useState<OperatorPerf | null>(null);
  const { data, isLoading, isError, refetch } = useAssociationAnalytics();

  const operators = data?.data.analytics.operatorsPerformance ?? [];

  if (selectedOp) {
    return <OperatorDetailScreen op={selectedOp} onBack={() => setSelectedOp(null)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader queryKeys={[QUERY_KEYS.ASSOCIATION_ANALYTICS]} isFetching={isLoading}>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Operators</Text>
          {isLoading && <ActivityIndicator size="small" color="#9ca3af" />}
        </View>
        {!isLoading && (
          <Text className="mt-1 text-sm text-zinc-400">{operators.length} operators</Text>
        )}
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>

        {isError && (
          <EmptyState
            icon="alert-circle-outline"
            title="Failed to load operators"
            description="Could not fetch operator data."
            actions={[{ label: 'Retry', onPress: refetch }]}
            classNames={{ root: 'py-16' }}
          />
        )}

        {!isLoading && !isError && operators.length === 0 && (
          <EmptyState
            icon="people-outline"
            title="No operators yet"
            description="No active operators found for this association."
            classNames={{ root: 'py-16' }}
          />
        )}

        {isLoading && (
          <View className="gap-0">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-row items-center gap-4 py-4 border-b border-neutral-100">
                <View className="h-10 w-10 rounded-full bg-neutral-100" />
                <View className="flex-1 gap-2">
                  <View className="h-4 w-32 rounded bg-neutral-100" />
                  <View className="h-3 w-48 rounded bg-neutral-100" />
                </View>
              </View>
            ))}
          </View>
        )}

        {!isLoading && operators.map((op) => (
          <OperatorRow
            key={op.terminalOperator.id}
            name={op.terminalOperator.name ?? '—'}
            role={op.terminalOperator.role ?? ''}
            revenue={`${op.revenueGenerated.toLocaleString()} ETB`}
            operationsHandled={op.operationsHandled}
            emergencyRequestCount={op.emergencyRequestCount}
            onPress={() => setSelectedOp(op)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
