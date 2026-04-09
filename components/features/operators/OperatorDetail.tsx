import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';

import { Collapsible } from '../../../components';
import type { OperatorMemberDetail } from '../../../types/operator.types';

interface OperatorDetailProps {
  operationsHandled: number;
  revenueGenerated: number;
  emergencyRequestCount: number;
  detail?: OperatorMemberDetail;
  isLoadingDetail?: boolean;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-neutral-50 p-4">
      <Text className="text-xs font-medium text-neutral-400 mb-1">{label}</Text>
      <Text className="text-xl font-black text-neutral-900">{value}</Text>
      {sub && <Text className="text-xs text-neutral-400 mt-0.5">{sub}</Text>}
    </View>
  );
}

export function OperatorDetail({
  operationsHandled,
  revenueGenerated,
  emergencyRequestCount,
  detail,
  isLoadingDetail,
}: OperatorDetailProps) {
  const checkIns = detail?.terminalOperator.checkInTerminalOperations.length ?? 0;
  const checkOuts = detail?.terminalOperator.checkOutTerminalOperations.length ?? 0;

  const recentOps = [
    ...(detail?.terminalOperator.checkInTerminalOperations ?? []),
    ...(detail?.terminalOperator.checkOutTerminalOperations ?? []),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <View className="gap-5 pb-8">
      {/* Performance stats */}
      <View className="flex-row gap-3">
        <StatCard label="Operations" value={String(operationsHandled)} />
        <StatCard label="Revenue" value={revenueGenerated.toLocaleString()} sub="ETB" />
      </View>

      {/* Check-in / Check-out counts — row layout */}
      {isLoadingDetail ? (
        <View className="flex-row items-center gap-2 py-2">
          <ActivityIndicator size="small" color="#9ca3af" />
          <Text className="text-xs text-neutral-400">Loading details…</Text>
        </View>
      ) : detail && (
        <View className="rounded-2xl bg-neutral-50 p-4 gap-3">
          <Text className="text-xs font-semibold text-neutral-400 tracking-widest mb-1">
            OPERATIONS BREAKDOWN
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-500">Check-ins</Text>
            <Text className="text-sm font-bold text-neutral-900">{checkIns}</Text>
          </View>
          <View className="h-px bg-neutral-100" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-500">Check-outs</Text>
            <Text className="text-sm font-bold text-neutral-900">{checkOuts}</Text>
          </View>
        </View>
      )}

      {/* Emergency requests — collapsible list with real data */}
      {detail?.terminalOperator.emergencyRequests && detail.terminalOperator.emergencyRequests.length > 0 && (
        <Collapsible
          icon="warning-outline"
          title="Emergency Requests"
          badge={detail.terminalOperator.emergencyRequests.length}
          >
          {detail.terminalOperator.emergencyRequests.map((req) => (
            <View key={req.id} className="flex-row items-start gap-3 py-3 border-b border-neutral-100">
              <View className={`mt-1.5 h-2 w-2 rounded-full ${
                req.status === 'RESOLVED' ? 'bg-success' :
                req.status === 'REJECTED' ? 'bg-destructive' : 'bg-warning-400'
              }`} />
              <View className="flex-1 gap-0.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-neutral-900">
                    {req.vehicle?.licensePlate ?? 'Unknown vehicle'}
                  </Text>
                  <Text className={`text-xs font-semibold ${
                    req.status === 'RESOLVED' ? 'text-success-600' :
                    req.status === 'REJECTED' ? 'text-destructive' : 'text-warning-600'
                  }`}>
                    {req.status}
                  </Text>
                </View>
                {req.vehicle?.type && (
                  <Text className="text-xs text-neutral-400">{req.vehicle.type}</Text>
                )}
                {req.reason && (
                  <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={2}>
                    {req.reason}
                  </Text>
                )}
                {req.destination && (
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons name="location-outline" size={11} color="#9ca3af" />
                    <Text className="text-xs text-neutral-400">{req.destination.name}</Text>
                  </View>
                )}
                <Text className="text-xs text-neutral-300 mt-0.5">
                  {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
            </View>
          ))}
        </Collapsible>
      )}

      {/* Recent activity — collapsible */}
      {recentOps.length > 0 && (
        <Collapsible
          icon="time-outline"
          title="Recent Activity"
          badge={recentOps.length}
          defaultOpen>
          {recentOps.map((op, i) => (
            <View key={`${op.id}-${i}`} className="flex-row items-start gap-3 py-3 border-b border-neutral-100">
              <View className={`mt-1.5 h-2 w-2 rounded-full ${op.type === 'CHECK_IN' ? 'bg-primary' : 'bg-success'}`} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-neutral-900">
                  {op.type === 'CHECK_IN' ? 'Checked in' : 'Checked out'}
                </Text>
                <Text className="text-xs text-neutral-400">
                  {new Date(op.checkInAt).toLocaleString([], {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}
        </Collapsible>
      )}
    </View>
  );
}
