import { create } from "zustand";
import type {
  AssignmentResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "@/types/assignment";
import * as assignmentsApi from "@/lib/api/assignments";

interface AssignmentState {
  assignments: AssignmentResponse[];
  selectedAssignment: AssignmentResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface AssignmentActions {
  fetchAssignments: (courseId?: string) => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<void>;
  createAssignment: (
    data: CreateAssignmentRequest
  ) => Promise<AssignmentResponse>;
  updateAssignment: (
    id: string,
    data: UpdateAssignmentRequest
  ) => Promise<AssignmentResponse>;
  publishAssignment: (id: string) => Promise<void>;
  closeSubmissions: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
}

export type AssignmentStore = AssignmentState & AssignmentActions;

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  selectedAssignment: null,
  isLoading: false,
  error: null,

  fetchAssignments: async (courseId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const assignments = await assignmentsApi.getAssignments(courseId);
      set({ assignments, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.detail || error?.message || "Failed to fetch assignments",
      });
    }
  },

  fetchAssignmentById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const assignment = await assignmentsApi.getAssignmentById(id);
      set({ selectedAssignment: assignment, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.detail || error?.message || "Failed to fetch assignment",
      });
    }
  },

  createAssignment: async (data: CreateAssignmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newAssignment = await assignmentsApi.createAssignment(data);
      set((state) => ({
        assignments: [newAssignment, ...state.assignments],
        isLoading: false,
      }));
      return newAssignment;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateAssignment: async (id: string, data: UpdateAssignmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await assignmentsApi.updateAssignment(id, data);
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.id === id ? updated : a
        ),
        selectedAssignment:
          state.selectedAssignment?.id === id
            ? updated
            : state.selectedAssignment,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  publishAssignment: async (id: string) => {
    try {
      await assignmentsApi.publishAssignment(id);
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.id === id ? { ...a, status: "Published" } : a
        ),
        selectedAssignment:
          state.selectedAssignment?.id === id
            ? { ...state.selectedAssignment, status: "Published" }
            : state.selectedAssignment,
      }));
    } catch (error) {
      throw error;
    }
  },

  closeSubmissions: async (id: string) => {
    try {
      await assignmentsApi.closeSubmissions(id);
      const closedAt = new Date().toISOString();
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.id === id ? { ...a, submissionsClosedAt: closedAt } : a
        ),
        selectedAssignment:
          state.selectedAssignment?.id === id
            ? { ...state.selectedAssignment, submissionsClosedAt: closedAt }
            : state.selectedAssignment,
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteAssignment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await assignmentsApi.deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
        selectedAssignment:
          state.selectedAssignment?.id === id
            ? null
            : state.selectedAssignment,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
