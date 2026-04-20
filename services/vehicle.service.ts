import { apiClient } from '../lib/axios';
import type { Vehicle, VehicleListResponse, VehicleResponse, VehicleOperationsResponse } from '../types/vehicle.types';
import type { TerminalOperation } from '../types/terminal-operation.types';

export const vehicleService = {
  search: async (query: string): Promise<Vehicle[]> => {
    const res = await apiClient.get<VehicleListResponse>('/vehicles', { params: { search: query, limit: 10, page: 1 } });
    return res.data.data.vehicles;
  },

  getByLicensePlate: async (plate: string): Promise<Vehicle> => {
    const res = await apiClient.get<VehicleResponse>(`/vehicles/license-plate/${encodeURIComponent(plate)}`);
    return res.data.data.vehicle;
  },

  getById: async (vehicleId: string): Promise<Vehicle> => {
    const res = await apiClient.get<VehicleResponse>(`/vehicles/${vehicleId}`);
    return res.data.data.vehicle;
  },

  getOperations: async (vehicleId: string): Promise<TerminalOperation[]> => {
    const res = await apiClient.get<VehicleOperationsResponse>(`/vehicles/${vehicleId}/terminal-operations`, {
      params: { page: 1, limit: 20 },
    });
    return res.data.data.terminalOperations;
  },
};
