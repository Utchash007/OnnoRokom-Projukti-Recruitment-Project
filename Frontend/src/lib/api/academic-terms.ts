import { apiClient } from "./client";
import type {
  AcademicTermResponse,
  CreateAcademicTermRequest,
  UpdateAcademicTermRequest,
} from "@/types/academic-term";

export async function getTerms(): Promise<AcademicTermResponse[]> {
  return apiClient<AcademicTermResponse[]>("/api/academic-terms");
}

export async function getTermById(
  id: string
): Promise<AcademicTermResponse> {
  return apiClient<AcademicTermResponse>(`/api/academic-terms/${id}`);
}

export async function createTerm(
  data: CreateAcademicTermRequest
): Promise<AcademicTermResponse> {
  return apiClient<AcademicTermResponse>("/api/academic-terms", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTerm(
  id: string,
  data: UpdateAcademicTermRequest
): Promise<AcademicTermResponse> {
  return apiClient<AcademicTermResponse>(`/api/academic-terms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTerm(id: string): Promise<void> {
  return apiClient<void>(`/api/academic-terms/${id}`, {
    method: "DELETE",
  });
}
