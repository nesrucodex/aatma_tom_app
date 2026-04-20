import { apiClient } from '../lib/axios';
import type { User, UserDetailResponse } from '../types/user.types';

export const userService = {
  getById: async (id: string): Promise<User> => {
    const res = await apiClient.get<UserDetailResponse>(`/users/${id}`);
    return res.data.data.user;
  },
};
