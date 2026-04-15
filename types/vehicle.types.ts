import { z } from 'zod';

export const vehicleStatusSchema = z.enum([
  'AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'OUT_OF_SERVICE',
]);

const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
}).loose();

const associationSchema = z.object({
  id: z.string(),
  name: z.string(),
  terminal: z.object({ id: z.string(), name: z.string() }).loose().nullable().optional(),
}).loose().optional();

const operatorInfoSchema = z.object({
  userId: z.string(),
  status: z.string(),
  user: userSchema.optional(),
  association: associationSchema,
}).loose().optional();

const terminalSchema = z.object({
  id: z.string(),
  name: z.string(),
}).loose().optional();

export const vehicleOperationSchema = z.object({
  id: z.string(),
  type: z.enum(['CHECK_IN', 'CHECK_OUT']),
  checkInAt: z.coerce.string(),
  checkOutAt: z.coerce.string().nullable(),
  waitingTimeMinutes: z.number().nullable(),
  terminalId: z.string().optional(),
  terminal: terminalSchema,
  checkInTerminalOperator: operatorInfoSchema,
  checkOutTerminalOperator: operatorInfoSchema.nullable().optional(),
  transaction: z.unknown().nullable().optional(),
}).loose();

export const vehicleSchema = z.object({
  id: z.string(),
  licensePlate: z.string(),
  model: z.string().nullable(),
  manufacturer: z.string().nullable(),
  year: z.number().nullable(),
  capacity: z.number().nullable(),
  type: z.string(),
  status: vehicleStatusSchema,
  routeId: z.string().nullable().optional(),
  route: z.object({
    id: z.string(),
    name: z.string(),
    fromId: z.string().optional(),
    toId: z.string().optional(),
    from: z.object({ id: z.string(), name: z.string() }).loose().optional(),
    to: z.object({ id: z.string(), name: z.string() }).loose().optional(),
  }).nullable().optional(),
  terminalOperations: z.array(vehicleOperationSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  vehicleMetadata: z.object({
    driverName: z.string().optional(),
    driverPhone: z.string().optional()
  }).optional()
});

export const vehicleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({ vehicle: vehicleSchema }),
});

export const vehicleListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    vehicles: z.array(vehicleSchema),
    pagination: z.object({ page: z.number(), limit: z.number(), total: z.number() }),
  }),
});

export const vehicleOperationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    terminalOperations: z.array(vehicleOperationSchema),
    pagination: z.object({ page: z.number(), limit: z.number(), total: z.number() }),
  }),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleOperation = z.infer<typeof vehicleOperationSchema>;
