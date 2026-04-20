export type ApiResponse<T> = {
  success: boolean;
  message: string;
  statusCode?: number;
  timestamp?: string;
  data: T;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};
