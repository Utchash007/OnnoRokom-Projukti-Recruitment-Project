import { apiClient } from "./client";
import type {
  SubmissionResponse,
  UpsertSubmissionRequest,
  ReviewSubmissionRequest,
} from "@/types/submission";

export async function getMySubmissions(): Promise<SubmissionResponse[]> {
  return apiClient<SubmissionResponse[]>("/api/submissions/mine");
}

export async function getAssignmentSubmissions(
  assignmentId: string
): Promise<SubmissionResponse[]> {
  return apiClient<SubmissionResponse[]>(
    `/api/submissions/assignments/${assignmentId}`
  );
}

export async function getSubmissionById(
  id: string
): Promise<SubmissionResponse> {
  return apiClient<SubmissionResponse>(`/api/submissions/${id}`);
}

export async function submitOrUpdate(
  assignmentId: string,
  data: UpsertSubmissionRequest
): Promise<SubmissionResponse> {
  return apiClient<SubmissionResponse>(
    `/api/submissions/assignments/${assignmentId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function reviewSubmission(
  id: string,
  data: ReviewSubmissionRequest
): Promise<SubmissionResponse> {
  return apiClient<SubmissionResponse>(`/api/submissions/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
