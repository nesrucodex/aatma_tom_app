import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../config/query-keys.config';
import { userService } from '../services/user.service';
import { useAuthStore } from '../store/auth.store';

export function useCurrentUser() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER, userId],
    queryFn: () => userService.getById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
