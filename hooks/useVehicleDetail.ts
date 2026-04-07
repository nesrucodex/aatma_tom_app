import { useQuery } from '@tanstack/react-query';

import { vehicleService } from '../services/vehicle.service';

export function useVehicleDetail(vehicleId: string | undefined) {
  const operationsQuery = useQuery({
    queryKey: ['vehicle-operations', vehicleId],
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
