import { useQuery } from '@tanstack/react-query';

import { operatorService } from '../services/operator.service';

export function useOperatorDetail(userId: string | undefined) {
  return useQuery({
    queryKey: ['operator-detail', userId],
    queryFn: () => operatorService.getMemberDetail(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}
