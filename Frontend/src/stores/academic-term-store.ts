import { create } from "zustand";
import type {
  AcademicTermResponse,
  CreateAcademicTermRequest,
  UpdateAcademicTermRequest,
} from "@/types/academic-term";
import * as termsApi from "@/lib/api/academic-terms";

interface AcademicTermState {
  terms: AcademicTermResponse[];
  selectedTerm: AcademicTermResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface AcademicTermActions {
  fetchTerms: () => Promise<void>;
  fetchTermById: (id: string) => Promise<void>;
  createTerm: (
    data: CreateAcademicTermRequest
  ) => Promise<AcademicTermResponse>;
  updateTerm: (
    id: string,
    data: UpdateAcademicTermRequest
  ) => Promise<AcademicTermResponse>;
  deleteTerm: (id: string) => Promise<void>;
}

export type AcademicTermStore = AcademicTermState & AcademicTermActions;

export const useAcademicTermStore = create<AcademicTermStore>((set) => ({
  terms: [],
  selectedTerm: null,
  isLoading: false,
  error: null,

  fetchTerms: async () => {
    set({ isLoading: true, error: null });
    try {
      const terms = await termsApi.getTerms();
      set({ terms, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch terms",
      });
    }
  },

  fetchTermById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const term = await termsApi.getTermById(id);
      set({ selectedTerm: term, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch term",
      });
    }
  },

  createTerm: async (data: CreateAcademicTermRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newTerm = await termsApi.createTerm(data);
      set((state) => ({
        terms: [...state.terms, newTerm],
        isLoading: false,
      }));
      return newTerm;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTerm: async (id: string, data: UpdateAcademicTermRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTerm = await termsApi.updateTerm(id, data);
      set((state) => ({
        terms: state.terms.map((t) => (t.id === id ? updatedTerm : t)),
        selectedTerm:
          state.selectedTerm?.id === id ? updatedTerm : state.selectedTerm,
        isLoading: false,
      }));
      return updatedTerm;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTerm: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await termsApi.deleteTerm(id);
      set((state) => ({
        terms: state.terms.filter((t) => t.id !== id),
        selectedTerm:
          state.selectedTerm?.id === id ? null : state.selectedTerm,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
