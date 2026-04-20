import type { ApiResponse } from "./api.types";

export enum UserRole {
  TERMINAL_OPERATOR = "TERMINAL_OPERATOR",
  TERMINAL_MANAGER = "TERMINAL_MANAGER",
  TERMINAL_VICE_MANAGER = "TERMINAL_VICE_MANAGER",
  TRAFFIC_POLICE = "TRAFFIC_POLICE",
  TRANSPORT_AUTHORITY = "TRANSPORT_AUTHORITY",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export type Terminal = {
  id: string;
  name: string;
  status: string;
  description: string | null;
};

export type Association = {
  id: string;
  name: string;
  status: string;
  terminalId: string | null;
  terminal: Terminal | null;
};

export type TerminalOperator = {
  userId: string;
  bankName: string;
  bankAccountNumber: string;
  associationId: string;
  association?: Association | null;
};

export type User = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  isActive?: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  terminalOperator?: TerminalOperator | null;
};

export type UserDetailResponse = ApiResponse<{ user: User }>;
