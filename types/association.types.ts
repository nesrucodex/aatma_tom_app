import { z } from 'zod';

const operatorPerformanceSchema = z.object({
  terminalOperator: z.object({
    id: z.string(),
    name: z.string().nullable(),
    phone: z.string().nullable(),
    role: z.string(),
  }).passthrough(),
  operationsHandled: z.number(),
  revenueGenerated: z.number(),
  emergencyRequestCount: z.number().default(0),
});

export const associationAnalyticsSchema = z.object({
  totalOperations: z.number(),
  activeOperators: z.number(),
  totalRevenue: z.number(),
  operationsByType: z.object({
    checkIn: z.number(),
    checkOut: z.number(),
  }),
  operatorsPerformance: z.array(operatorPerformanceSchema),
});

export const associationAnalyticsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    analytics: associationAnalyticsSchema,
  }),
});

export type AssociationAnalytics = z.infer<typeof associationAnalyticsSchema>;
export type AssociationAnalyticsResponse = z.infer<typeof associationAnalyticsResponseSchema>;
