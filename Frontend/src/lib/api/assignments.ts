import { apiClient } from "./client";
import type {
  AssignmentResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "@/types/assignment";

export async function getAssignments(
  courseId?: string
): Promise<AssignmentResponse[]> {
  const query = courseId ? `?courseId=${courseId}` : "";
  return apiClient<AssignmentResponse[]>(`/api/assignments${query}`);
}

export async function getAssignmentById(
  id: string
): Promise<AssignmentResponse> {
  return apiClient<AssignmentResponse>(`/api/assignments/${id}`);
}

export async function createAssignment(
  data: CreateAssignmentRequest
): Promise<AssignmentResponse> {
  return apiClient<AssignmentResponse>("/api/assignments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAssignment(
  id: string,
  data: UpdateAssignmentRequest
): Promise<AssignmentResponse> {
  return apiClient<AssignmentResponse>(`/api/assignments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function publishAssignment(id: string): Promise<void> {
  return apiClient<void>(`/api/assignments/${id}/publish`, {
    method: "PATCH",
  });
}

export async function closeSubmissions(id: string): Promise<void> {
  return apiClient<void>(`/api/assignments/${id}/close-submissions`, {
    method: "PATCH",
  });
}

export async function deleteAssignment(id: string): Promise<void> {
  return apiClient<void>(`/api/assignments/${id}`, {
    method: "DELETE",
  });
}
