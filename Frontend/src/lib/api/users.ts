import { apiClient } from "./client";
import type { UserRole } from "@/types/enums";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  SetActiveStatusRequest,
  ChangePasswordRequest,
} from "@/types/user";

export async function getUsers(role?: UserRole): Promise<UserResponse[]> {
  const query = role ? `?role=${role}` : "";
  return apiClient<UserResponse[]>(`/api/users${query}`);
}

export async function getUserById(id: string): Promise<UserResponse> {
  return apiClient<UserResponse>(`/api/users/${id}`);
}

export async function createUser(
  data: CreateUserRequest
): Promise<UserResponse> {
  return apiClient<UserResponse>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: UpdateUserRequest
): Promise<UserResponse> {
  return apiClient<UserResponse>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function setActiveStatus(
  id: string,
  data: SetActiveStatusRequest
): Promise<void> {
  return apiClient<void>(`/api/users/${id}/active-status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(
  id: string,
  data: ChangePasswordRequest
): Promise<void> {
  return apiClient<void>(`/api/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
