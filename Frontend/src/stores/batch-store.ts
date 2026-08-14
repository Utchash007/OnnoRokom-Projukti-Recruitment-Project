import { create } from "zustand";
import type {
  BatchResponse,
  CreateBatchRequest,
  UpdateBatchRequest,
  BatchStudentResponse,
  AssignStudentRequest,
  SetBatchEnrollmentStatusRequest,
} from "@/types/batch";
import * as batchesApi from "@/lib/api/batches";

interface BatchState {
  batches: BatchResponse[];
  selectedBatch: BatchResponse | null;
  batchStudents: BatchStudentResponse[];
  isLoading: boolean;
  isStudentsLoading: boolean;
  error: string | null;
}

interface BatchActions {
  fetchBatches: () => Promise<void>;
  fetchBatchById: (id: string) => Promise<void>;
  createBatch: (data: CreateBatchRequest) => Promise<BatchResponse>;
  updateBatch: (
    id: string,
    data: UpdateBatchRequest
  ) => Promise<BatchResponse>;
  deleteBatch: (id: string) => Promise<void>;
  fetchBatchStudents: (batchId: string) => Promise<void>;
  assignStudent: (
    batchId: string,
    data: AssignStudentRequest
  ) => Promise<BatchStudentResponse>;
  setBatchEnrollmentStatus: (
    batchId: string,
    enrollmentId: string,
    data: SetBatchEnrollmentStatusRequest
  ) => Promise<void>;
}

export type BatchStore = BatchState & BatchActions;

export const useBatchStore = create<BatchStore>((set) => ({
  batches: [],
  selectedBatch: null,
  batchStudents: [],
  isLoading: false,
  isStudentsLoading: false,
  error: null,

  fetchBatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const batches = await batchesApi.getBatches();
      set({ batches, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch batches",
      });
    }
  },

  fetchBatchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await batchesApi.getBatchById(id);
      set({ selectedBatch: batch, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch batch",
      });
    }
  },

  createBatch: async (data: CreateBatchRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newBatch = await batchesApi.createBatch(data);
      set((state) => ({
        batches: [...state.batches, newBatch],
        isLoading: false,
      }));
      return newBatch;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateBatch: async (id: string, data: UpdateBatchRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBatch = await batchesApi.updateBatch(id, data);
      set((state) => ({
        batches: state.batches.map((b) => (b.id === id ? updatedBatch : b)),
        selectedBatch:
          state.selectedBatch?.id === id ? updatedBatch : state.selectedBatch,
        isLoading: false,
      }));
      return updatedBatch;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteBatch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await batchesApi.deleteBatch(id);
      set((state) => ({
        batches: state.batches.filter((b) => b.id !== id),
        selectedBatch:
          state.selectedBatch?.id === id ? null : state.selectedBatch,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchBatchStudents: async (batchId: string) => {
    set({ isStudentsLoading: true });
    try {
      const students = await batchesApi.getBatchStudents(batchId);
      set({ batchStudents: students, isStudentsLoading: false });
    } catch (error) {
      set({ isStudentsLoading: false });
      throw error;
    }
  },

  assignStudent: async (batchId: string, data: AssignStudentRequest) => {
    try {
      const res = await batchesApi.assignStudent(batchId, data);
      set((state) => ({
        batchStudents: [res, ...state.batchStudents],
      }));
      return res;
    } catch (error) {
      throw error;
    }
  },

  setBatchEnrollmentStatus: async (
    batchId: string,
    enrollmentId: string,
    data: SetBatchEnrollmentStatusRequest
  ) => {
    try {
      await batchesApi.setBatchEnrollmentStatus(batchId, enrollmentId, data);
      set((state) => ({
        batchStudents: state.batchStudents.map((s) =>
          s.enrollmentId === enrollmentId ? { ...s, status: data.status } : s
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
