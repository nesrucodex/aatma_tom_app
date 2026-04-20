import type { ApiResponse } from "./api.types";
import type { TerminalOperationType } from "./terminal-operation.types";
import { User } from "./user.types";

export type OperationItem = {
  id: string;
  type: TerminalOperationType;
  checkInAt: string;
  checkOutAt: string | null;
  waitingTimeMinutes: number | null;
  terminalId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
};

export type EmergencyVehicle = {
  id: string;
  licensePlate: string;
  type: string;
};

export type EmergencyDestination = {
  id: string;
  name: string;
};

export type EmergencyRequest = {
  id: string;
  reason: string | null;
  status: string;
  resolvedAt: string | null;
  resolutionNotes: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle: EmergencyVehicle | null;
  destination: EmergencyDestination | null;
};

export type SalaryPayment = {
  id: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
};


export type OperatorAssociation = {
  id: string;
  name: string;
  status: string;
};

export type OperatorDetail = {
  userId: string;
  status: string;
  bankName: string;
  bankAccountNumber: string;
  associationId: string;
  user: User;
  association: OperatorAssociation;
  emergencyRequests?: EmergencyRequest[];
};

export type OpsPagination = {
  page: number;
  limit: number;
  checkInTotal: number;
  checkOutTotal: number;
  total: number;
};

export type OperatorMemberDetail = {
  terminalOperator: OperatorDetail;
  terminalOperations: OperationItem[];
  receivedSalary: number;
  pendingPayment: number;
  totalEarning: number;
  operatorSalaryTransactions: SalaryPayment[];
  opsPagination: OpsPagination;
};

export type OperatorMemberDetailResponse = ApiResponse<OperatorMemberDetail>;
