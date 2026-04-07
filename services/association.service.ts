import { apiClient } from '../lib/axios';
import {
  associationAnalyticsResponseSchema,
  type AssociationAnalyticsResponse,
} from '../types/association.types';

export const associationService = {
  getAnalytics: async (associationId: string): Promise<AssociationAnalyticsResponse> => {
    const res = await apiClient.get(`/associations/${associationId}/reports/analytics`);
    return associationAnalyticsResponseSchema.parse(res.data);
  },
};
