import { apiClient } from '../lib/axios';
import {
  vehicleListResponseSchema,
  vehicleResponseSchema,
  vehicleOperationsResponseSchema,
  type Vehicle,
  type VehicleOperation,
} from '../types/vehicle.types';

export const vehicleService = {
  search: async (query: string): Promise<Vehicle[]> => {
    const res = await apiClient.get('/vehicles', { params: { search: query, limit: 10, page: 1 } });
    return vehicleListResponseSchema.parse(res.data).data.vehicles;
  },

  getByLicensePlate: async (plate: string): Promise<Vehicle> => {
    const res = await apiClient.get(`/vehicles/license-plate/${encodeURIComponent(plate)}`);
    return vehicleResponseSchema.parse(res.data).data.vehicle;
  },

  getOperations: async (vehicleId: string): Promise<VehicleOperation[]> => {
    const res = await apiClient.get(`/vehicles/${vehicleId}/terminal-operations`, {
      params: { page: 1, limit: 20 },
    });
    return vehicleOperationsResponseSchema.parse(res.data).data.terminalOperations;
  },
};
