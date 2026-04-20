import { apiClient } from '../lib/axios';
import type { AssociationAnalytics, AssociationAnalyticsResponse } from '../types/association.types';

export const associationService = {
  getAnalytics: async (associationId: string): Promise<AssociationAnalytics> => {
    const res = await apiClient.get<AssociationAnalyticsResponse>(`/associations/${associationId}/reports/analytics`);
    return res.data.data.analytics;
  },
};
