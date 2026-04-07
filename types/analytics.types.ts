import { z } from 'zod';

export const financialOverviewSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    analytics: z.object({
      activeVehicleCount: z.number(),
      vehicleInWaitingQueue: z.number(),
      checkedOutVehicleCount: z.number(),
      totalRevenueGenerated: z.number(),
    }),
  }),
});

export type FinancialOverview = z.infer<typeof financialOverviewSchema>;
export type FinancialAnalytics = FinancialOverview['data']['analytics'];
