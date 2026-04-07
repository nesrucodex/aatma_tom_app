import { apiClient } from '../lib/axios';
import { userDetailResponseSchema, type UserDetail } from '../types/user.types';

export const userService = {
  getById: async (id: string): Promise<UserDetail> => {
    const res = await apiClient.get(`/users/${id}`);
    return userDetailResponseSchema.parse(res.data).data.user;
  },
};
