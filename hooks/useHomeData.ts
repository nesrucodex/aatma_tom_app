import { useQuery } from '@tanstack/react-query';

import { associationService } from '../services/association.service';
import { terminalOperationService } from '../services/terminal-operation.service';
import { useAuthStore } from '../store/auth.store';

export function useAssociationAnalytics() {
  const user = useAuthStore((s) => s.user);
  const associationId = (user?.terminalOperator as any)?.associationId as string | undefined;

  return useQuery({
    queryKey: ['association-analytics', associationId],
    queryFn: () => associationService.getAnalytics(associationId!),
    enabled: !!associationId,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useTerminalOperations(terminalId?: string) {
  return useQuery({
    queryKey: ['terminal-operations', terminalId],
    queryFn: () => {
      const now = new Date();
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24h
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
