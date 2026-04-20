import type { ApiResponse, Pagination } from "./api.types";
import type { TerminalOperation } from "./terminal-operation.types";

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  IN_TRANSIT = "IN_TRANSIT",
  MAINTENANCE = "MAINTENANCE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export type VehicleRoute = {
  id: string;
  name: string;
  fromId?: string;
  toId?: string;
  from?: { id: string; name: string };
  to?: { id: string; name: string };
};

export type VehicleMetadata = {
  driverName?: string;
  driverPhone?: string;
};

export type Vehicle = {
  id: string;
  licensePlate: string;
  capacity: number | null;
  type: string;
  status: VehicleStatus;
  routeId?: string | null;
  route?: VehicleRoute | null;
  terminalOperations?: TerminalOperation[];
  createdAt: string;
  updatedAt: string;
  vehicleMetadata?: VehicleMetadata;
};

export type VehicleResponse = ApiResponse<{ vehicle: Vehicle }>;

export type VehicleListResponse = ApiResponse<{
  vehicles: Vehicle[];
  pagination: Pagination;
}>;

export type VehicleOperationsResponse = ApiResponse<{
  terminalOperations: TerminalOperation[];
  pagination: Pagination;
}>;

// alias for backwards compat
export type VehicleOperation = TerminalOperation;
