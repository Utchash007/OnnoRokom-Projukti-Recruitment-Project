import { create } from "zustand";
import type {
  SubmissionResponse,
  UpsertSubmissionRequest,
  ReviewSubmissionRequest,
} from "@/types/submission";
import * as submissionsApi from "@/lib/api/submissions";

interface SubmissionState {
  mySubmissions: SubmissionResponse[];
  assignmentSubmissions: SubmissionResponse[];
  selectedSubmission: SubmissionResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface SubmissionActions {
  fetchMySubmissions: () => Promise<void>;
  fetchAssignmentSubmissions: (assignmentId: string) => Promise<void>;
  fetchSubmissionById: (id: string) => Promise<void>;
  submitOrUpdate: (
    assignmentId: string,
    data: UpsertSubmissionRequest
  ) => Promise<SubmissionResponse>;
  reviewSubmission: (
    id: string,
    data: ReviewSubmissionRequest
  ) => Promise<SubmissionResponse>;
  setSelectedSubmission: (submission: SubmissionResponse | null) => void;
}

export type SubmissionStore = SubmissionState & SubmissionActions;

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  mySubmissions: [],
  assignmentSubmissions: [],
  selectedSubmission: null,
  isLoading: false,
  error: null,

  fetchMySubmissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const submissions = await submissionsApi.getMySubmissions();
      set({ mySubmissions: submissions, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.detail || error?.message || "Failed to fetch my submissions",
      });
    }
  },

  fetchAssignmentSubmissions: async (assignmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const submissions =
        await submissionsApi.getAssignmentSubmissions(assignmentId);
      set({ assignmentSubmissions: submissions, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.detail ||
          error?.message ||
          "Failed to fetch assignment submissions",
      });
    }
  },

  fetchSubmissionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await submissionsApi.getSubmissionById(id);
      set({ selectedSubmission: submission, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.detail || error?.message || "Failed to fetch submission",
      });
    }
  },

  submitOrUpdate: async (
    assignmentId: string,
    data: UpsertSubmissionRequest
  ) => {
    set({ isLoading: true });
    try {
      const res = await submissionsApi.submitOrUpdate(assignmentId, data);
      set((state) => ({
        mySubmissions: state.mySubmissions.some((s) => s.id === res.id)
          ? state.mySubmissions.map((s) => (s.id === res.id ? res : s))
          : [res, ...state.mySubmissions],
        selectedSubmission: res,
        isLoading: false,
      }));
      return res;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  reviewSubmission: async (
    id: string,
    data: ReviewSubmissionRequest
  ) => {
    set({ isLoading: true });
    try {
      const updated = await submissionsApi.reviewSubmission(id, data);
      set((state) => ({
        assignmentSubmissions: state.assignmentSubmissions.map((s) =>
          s.id === id ? updated : s
        ),
        selectedSubmission:
          state.selectedSubmission?.id === id
            ? updated
            : state.selectedSubmission,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setSelectedSubmission: (submission) =>
    set({ selectedSubmission: submission }),
}));
