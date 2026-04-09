import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../config/query-keys.config';
import { terminalOperationService } from '../services/terminal-operation.service';

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => terminalOperationService.checkIn(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE_DETAIL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE_DETAIL_OPERATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TERMINAL_OPERATIONS] });
    },
  });
}
