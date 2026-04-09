export const QUERY_KEYS = {
  VEHICLE: 'vehicle',
  VEHICLE_DETAIL: 'vehicle-detail',
  VEHICLE_DETAIL_OPERATIONS: 'vehicle-detail-operations',
  VEHICLES_SEARCH: 'vehicles-search',
  TERMINAL_OPERATIONS: 'terminal-operations',
  ASSOCIATION_ANALYTICS: 'association-analytics',
  CURRENT_USER: 'current-user',
  OPERATOR_DETAIL: 'operator-detail',
} as const;

export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
