import type { ApiResponse, Pagination } from "./api.types";
import type { User } from "./user.types";
import type { Vehicle } from "./vehicle.types";

export enum TerminalOperationType {
  CHECK_IN = "CHECK_IN",
  CHECK_OUT = "CHECK_OUT",
}

export type TerminalRef = {
  id: string;
  name: string;
  status: string;
};

export type TerminalOperatorRef = {
  userId: string;
  status: string;
  user?: User;
  association?: {
    id: string;
    name: string;
    terminal?: { id: string; name: string } | null;
  } | null;
};

export type TerminalOperation = {
  id: string;
  type: TerminalOperationType;
  waitingTimeMinutes: number | null;
  checkInAt: string;
  checkOutAt: string | null;
  terminalId: string;
  vehicleId: string;
  checkInTerminalOperatorId: string;
  checkOutTerminalOperatorId: string | null;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  terminal: TerminalRef;
  vehicle?: Vehicle;
  checkInTerminalOperator: TerminalOperatorRef;
  checkOutTerminalOperator: TerminalOperatorRef | null;
  transaction: unknown | null;
};

export type TerminalOperationsResponse = ApiResponse<{
  operations: TerminalOperation[];
  pagination: Pagination;
}>;

export type { Pagination };
