import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../config/query-keys.config';
import { associationService } from '../services/association.service';
import { terminalOperationService } from '../services/terminal-operation.service';
import { useAuthStore } from '../store/auth.store';
import { TerminalOperator } from '@/types/user.types';

export function useAssociationAnalytics() {
  const user = useAuthStore((s) => s.user);
  const associationId = (user?.terminalOperator as TerminalOperator)?.associationId as string | undefined;

  return useQuery({
    queryKey: [QUERY_KEYS.ASSOCIATION_ANALYTICS, associationId],
    queryFn: () => associationService.getAnalytics(associationId!),
    enabled: !!associationId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTerminalOperations(terminalId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TERMINAL_OPERATIONS, terminalId],
    queryFn: () => {
      const now = new Date();
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return terminalOperationService.getOperations({
        terminalId,
        limit: 50,
        page: 1,
        from: from.toISOString(),
        to: now.toISOString(),
      });
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
}
