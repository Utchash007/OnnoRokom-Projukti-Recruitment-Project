import { create } from "zustand";
import type { AttachmentResponse } from "@/types/submission-attachment";
import * as attachmentsApi from "@/lib/api/submission-attachments";

interface AttachmentState {
  isUploading: boolean;
  isDeleting: boolean;
  error: string | null;
}

interface AttachmentActions {
  uploadAttachment: (
    submissionId: string,
    file: File
  ) => Promise<AttachmentResponse>;
  downloadAttachment: (
    attachmentId: string,
    fileName: string
  ) => Promise<void>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
}

export type SubmissionAttachmentStore = AttachmentState & AttachmentActions;

export const useSubmissionAttachmentStore =
  create<SubmissionAttachmentStore>((set) => ({
    isUploading: false,
    isDeleting: false,
    error: null,

    uploadAttachment: async (submissionId: string, file: File) => {
      set({ isUploading: true, error: null });
      try {
        const res = await attachmentsApi.uploadAttachment(
          submissionId,
          file
        );
        set({ isUploading: false });
        return res;
      } catch (error: any) {
        set({
          isUploading: false,
          error: error?.detail || error?.message || "Failed to upload file",
        });
        throw error;
      }
    },

    downloadAttachment: async (
      attachmentId: string,
      fileName: string
    ) => {
      try {
        const blob = await attachmentsApi.downloadAttachment(attachmentId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        throw error;
      }
    },

    deleteAttachment: async (attachmentId: string) => {
      set({ isDeleting: true, error: null });
      try {
        await attachmentsApi.deleteAttachment(attachmentId);
        set({ isDeleting: false });
      } catch (error: any) {
        set({
          isDeleting: false,
          error: error?.detail || error?.message || "Failed to delete file",
        });
        throw error;
      }
    },
  }));
