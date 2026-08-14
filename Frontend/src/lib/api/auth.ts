import { apiClient } from "./client";
import type {
  LoginRequest,
  AuthenticationResponse,
  CurrentUserResponse,
} from "@/types/auth";

export async function login(
  data: LoginRequest
): Promise<AuthenticationResponse> {
  return apiClient<AuthenticationResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  return apiClient<void>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getMe(): Promise<CurrentUserResponse> {
  return apiClient<CurrentUserResponse>("/api/auth/me");
}
