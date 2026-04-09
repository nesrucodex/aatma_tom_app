import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../config/query-keys.config';
import { operatorService } from '../services/operator.service';

export function useOperatorDetail(userId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.OPERATOR_DETAIL, userId],
    queryFn: () => operatorService.getMemberDetail(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}
