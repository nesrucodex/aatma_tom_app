import type { ApiResponse } from "./api.types";

export type OperatorPerformance = {
  terminalOperator: {
    id: string;
    name: string | null;
    phone: string | null;
    role: string;
  };
  operationsHandled: number;
  revenueGenerated: number;
  emergencyRequestCount: number;
};

export type AssociationAnalytics = {
  totalOperations: number;
  activeOperators: number;
  totalRevenue: number;
  operationsByType: {
    checkIn: number;
    checkOut: number;
  };
  operatorsPerformance: OperatorPerformance[];
};

export type AssociationAnalyticsResponse = ApiResponse<{
  analytics: AssociationAnalytics;
}>;
