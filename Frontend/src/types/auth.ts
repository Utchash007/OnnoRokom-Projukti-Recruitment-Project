import type { UserRole } from "./enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthenticationResponse {
  accessToken: string;
  expiresAt: string;
  user: CurrentUserResponse;
}
