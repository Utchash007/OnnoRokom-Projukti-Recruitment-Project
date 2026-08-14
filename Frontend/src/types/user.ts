import type { UserRole } from "./enums";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  roll: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  roll?: string | null;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  roll?: string | null;
}

export interface SetActiveStatusRequest {
  isActive: boolean;
}

export interface ChangePasswordRequest {
  newPassword: string;
}
