import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../../components';
import { VehicleCard } from '../../../components/features/search/VehicleCard';
import ScreeenHeader from '../../../components/shared/ScreeenHeader';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useVehicleSearch } from '../../../hooks/useVehicleSearch';
import type { Vehicle } from '../../../types/vehicle.types';

function ResultRow({ vehicle, onPress }: { vehicle: Vehicle; onPress: () => void }) {
  const latestOp = vehicle.terminalOperations?.[0];
  const station = latestOp?.terminal?.name
    ?? latestOp?.checkInTerminalOperator?.association?.terminal?.name
    ?? '—';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-3.5 border-b border-neutral-100">
      <View>
        <Text className="text-sm font-bold text-neutral-900">{vehicle.licensePlate}</Text>
        <Text className="text-xs text-neutral-400 mt-0.5">{vehicle.type} · {station}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className={`h-2 w-2 rounded-full ${vehicle.status === 'AVAILABLE' ? 'bg-success' : 'bg-primary'}`} />
        <Text className="text-xs text-neutral-400">{vehicle.status.replace('_', ' ')}</Text>
        <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const { data: userDetail } = useCurrentUser();
  const managerTerminalId = userDetail?.terminalOperator?.association?.terminal?.id;

  const { query, setQuery, results, isSearching, vehicle, operations, isLoadingDetail, selectVehicle, clearSelection } =
    useVehicleSearch();

  const latestOp = operations[0];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader>
        <Text className="text-2xl font-bold text-white mb-4">Search Vehicle</Text>
        <View className="flex-row items-center gap-3 rounded-2xl bg-zinc-800 px-4 h-14">
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            className="flex-1 text-base text-white"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            placeholderTextColor="#4b5563"
            placeholder="License plate, model…"
            autoCapitalize="characters"
          />
          {isSearching || isLoadingDetail ? (
            <ActivityIndicator size="small" color="#6b7280" />
          ) : query.length > 0 ? (
            <TouchableOpacity onPress={clearSelection} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text className="mt-2 text-xs text-zinc-500">
          Type to search by plate, model or manufacturer
        </Text>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>

        {!query && !vehicle && (
          <EmptyState
            icon="search-outline"
            title="Search for a vehicle"
            description="Type a license plate, model or manufacturer."
            classNames={{ root: 'py-16' }}
          />
        )}

        {!vehicle && results.length > 0 && (
          <View className="rounded-b-xl bg-white border border-neutral-100 px-4 overflow-hidden mb-4"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            {results.map((v) => (
              <ResultRow key={v.id} vehicle={v} onPress={() => selectVehicle(v)} />
            ))}
          </View>
        )}

        {!vehicle && query.length >= 2 && !isSearching && results.length === 0 && (
          <EmptyState
            icon="car-outline"
            title="No vehicles found"
            description={`No match for "${query}"`}
            classNames={{ root: 'py-16' }}
          />
        )}

        {isLoadingDetail && vehicle && (
          <VehicleCard
            loading
            vehicle={vehicle}
            operations={operations}
            onAction={() => {}}
            onViewDetail={() => {}}
          />
        )}

        {/* Result card */}
        {vehicle && !isLoadingDetail && (
          <VehicleCard
            vehicle={vehicle}
            operations={operations}
            onAction={(vehicleId) =>
              router.push({ pathname: '/(tabs)/search/resolve', params: { vehicleId } })
            }
            onViewDetail={(vehicleId) =>
              router.push({ pathname: '/(tabs)/search/vehicle', params: { vehicleId } })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
