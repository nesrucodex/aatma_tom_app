import { useMutation, useQueryClient } from '@tanstack/react-query';

import { terminalOperationService } from '../services/terminal-operation.service';

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => terminalOperationService.checkIn(vehicleId),
    onSuccess: () => {
      // Invalidate vehicle searches and operations so they refresh
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
      queryClient.invalidateQueries({ queryKey: ['terminal-operations'] });
    },
  });
}
