import type { ApiResponse } from "./api.types";
import type { User } from "./user.types";

export type { User };
export { UserRole, UserStatus } from "./user.types";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

export type RequestOtpResponse = ApiResponse<{
  user: User;
  retryAfter: number;
  expiry: number;
}>;

export type VerifyOtpResponse = ApiResponse<{
  user: User;
  tokens: Tokens;
}>;
