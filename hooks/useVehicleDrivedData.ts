import { useCurrentUser } from '../hooks/useCurrentUser';
import type { Vehicle, VehicleOperation } from '../types/vehicle.types';

export interface VehicleDrivedData {
  isEmptyOperation: boolean;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  statusKey: 'checked-in' | 'checked-out';
  station: string;
  operator: string;
  duration: string;
  routeName: string | null;
  routeTerminalIds: string[];
  canAct: boolean;
  canResolveAndCheckIn: boolean;
  timeline: { label: string; time: string; station: string }[];
}

const DEFAULTS: VehicleDrivedData = {
  isEmptyOperation: true,
  isCheckedIn: false,
  isCheckedOut: false,
  statusKey: 'checked-out',
  station: '—',
  operator: '—',
  duration: '—',
  routeName: null,
  routeTerminalIds: [],
  canAct: true,
  canResolveAndCheckIn: false,
  timeline: [],
};

export function useVehicleDrivedData(
  vehicle: Vehicle | undefined | null,
  operations: VehicleOperation[],
): VehicleDrivedData {
  const { data: userDetail } = useCurrentUser();
  const managerTerminalId = userDetail?.terminalOperator?.association?.terminal?.id;

  if (!vehicle) return DEFAULTS;

  const latestOperation = operations[0];
  const isEmptyOperation = operations.length === 0;
  const isCheckedIn  = latestOperation?.type === 'CHECK_IN';
  const isCheckedOut = latestOperation?.type === 'CHECK_OUT';
  const statusKey: 'checked-in' | 'checked-out' = isCheckedOut ? 'checked-out' : 'checked-in';

  const station = latestOperation?.terminal?.name
    ?? latestOperation?.checkInTerminalOperator?.association?.terminal?.name
    ?? '—';

  const operator = latestOperation?.checkInTerminalOperator?.user?.name ?? '—';

  const duration = latestOperation
    ? new Date(latestOperation.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  const routeName = vehicle.route?.name ?? null;

  const routeTerminalIds = [
    (vehicle.route as any)?.fromId,
    (vehicle.route as any)?.toId,
    (vehicle.route as any)?.from?.id,
    (vehicle.route as any)?.to?.id,
  ].filter(Boolean) as string[];

  const canAct = !managerTerminalId || routeTerminalIds.length === 0
    ? true
    : routeTerminalIds.includes(managerTerminalId);

  const canResolveAndCheckIn =
    isCheckedIn &&
    !!managerTerminalId &&
    managerTerminalId !== latestOperation?.terminalId;

  const timeline = operations.slice(0, 5).map((op) => ({
    label: op.type === 'CHECK_IN' ? 'Checked in' : 'Checked out',
    time: new Date(op.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    station: op.terminal?.name ?? op.checkInTerminalOperator?.association?.terminal?.name ?? '—',
  }));

  return {
    isEmptyOperation,
    isCheckedIn,
    isCheckedOut,
    statusKey,
    station,
    operator,
    duration,
    routeName,
    routeTerminalIds,
    canAct,
    canResolveAndCheckIn,
    timeline,
  };
}
