import { apiClient } from "./client";
import type {
  BatchResponse,
  CreateBatchRequest,
  UpdateBatchRequest,
  BatchStudentResponse,
  AssignStudentRequest,
  SetBatchEnrollmentStatusRequest,
} from "@/types/batch";

export async function getBatches(): Promise<BatchResponse[]> {
  return apiClient<BatchResponse[]>("/api/batches");
}

export async function getBatchById(id: string): Promise<BatchResponse> {
  return apiClient<BatchResponse>(`/api/batches/${id}`);
}

export async function createBatch(
  data: CreateBatchRequest
): Promise<BatchResponse> {
  return apiClient<BatchResponse>("/api/batches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBatch(
  id: string,
  data: UpdateBatchRequest
): Promise<BatchResponse> {
  return apiClient<BatchResponse>(`/api/batches/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBatch(id: string): Promise<void> {
  return apiClient<void>(`/api/batches/${id}`, {
    method: "DELETE",
  });
}

export async function getBatchStudents(
  id: string
): Promise<BatchStudentResponse[]> {
  return apiClient<BatchStudentResponse[]>(`/api/batches/${id}/students`);
}

export async function assignStudent(
  batchId: string,
  data: AssignStudentRequest
): Promise<BatchStudentResponse> {
  return apiClient<BatchStudentResponse>(
    `/api/batches/${batchId}/students`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function setBatchEnrollmentStatus(
  batchId: string,
  enrollmentId: string,
  data: SetBatchEnrollmentStatusRequest
): Promise<void> {
  return apiClient<void>(
    `/api/batches/${batchId}/enrollments/${enrollmentId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
