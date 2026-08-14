import { apiClient } from "./client";
import type { AttachmentResponse } from "@/types/submission-attachment";

export async function uploadAttachment(
  submissionId: string,
  file: File
): Promise<AttachmentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<AttachmentResponse>(
    `/api/submission-attachments/submissions/${submissionId}`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function downloadAttachment(
  attachmentId: string
): Promise<Blob> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `/api/submission-attachments/${attachmentId}`,
    { headers }
  );

  if (!res.ok) {
    throw new Error("Failed to download attachment");
  }

  return res.blob();
}

export async function deleteAttachment(
  attachmentId: string
): Promise<void> {
  return apiClient<void>(
    `/api/submission-attachments/${attachmentId}`,
    {
      method: "DELETE",
    }
  );
}
