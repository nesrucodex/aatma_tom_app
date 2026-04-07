import { useQuery } from '@tanstack/react-query';

import { userService } from '../services/user.service';
import { useAuthStore } from '../store/auth.store';

export function useCurrentUser() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['current-user', userId],
    queryFn: () => userService.getById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 min — user detail doesn't change often
  });
}
