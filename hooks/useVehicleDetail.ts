import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../config/query-keys.config';
import { vehicleService } from '../services/vehicle.service';

export function useVehicleDetail(vehicleId: string | undefined) {
  const operationsQuery = useQuery({
    queryKey: [QUERY_KEYS.VEHICLE_DETAIL_OPERATIONS, vehicleId],
    queryFn: () => vehicleService.getOperations(vehicleId!),
    enabled: !!vehicleId,
    staleTime: 1000 * 60,
  });

  return {
    operations: operationsQuery.data ?? [],
    isLoading: operationsQuery.isLoading,
    isError: operationsQuery.isError,
    refetch: operationsQuery.refetch,
  };
}

export function useVehicleById(vehicleId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLE, vehicleId],
    queryFn: () => vehicleService.getById(vehicleId!),
    enabled: !!vehicleId,
    staleTime: 1000 * 60,
  });
}
