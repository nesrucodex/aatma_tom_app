import type { ApiResponse } from "./api.types";

export type FinancialAnalytics = {
  activeVehicleCount: number;
  vehicleInWaitingQueue: number;
  checkedOutVehicleCount: number;
  totalRevenueGenerated: number;
};

export type FinancialOverviewResponse = ApiResponse<{
  analytics: FinancialAnalytics;
}>;
