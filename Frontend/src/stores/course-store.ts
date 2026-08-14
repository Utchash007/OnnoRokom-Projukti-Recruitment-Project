import { create } from "zustand";
import type {
  CourseResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";
import * as coursesApi from "@/lib/api/courses";

interface CourseState {
  courses: CourseResponse[];
  selectedCourse: CourseResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface CourseActions {
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  createCourse: (data: CreateCourseRequest) => Promise<CourseResponse>;
  updateCourse: (
    id: string,
    data: UpdateCourseRequest
  ) => Promise<CourseResponse>;
  deleteCourse: (id: string) => Promise<void>;
}

export type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await coursesApi.getCourses();
      set({ courses, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch courses",
      });
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const course = await coursesApi.getCourseById(id);
      set({ selectedCourse: course, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch course",
      });
    }
  },

  createCourse: async (data: CreateCourseRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newCourse = await coursesApi.createCourse(data);
      set((state) => ({
        courses: [...state.courses, newCourse],
        isLoading: false,
      }));
      return newCourse;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCourse: async (id: string, data: UpdateCourseRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCourse = await coursesApi.updateCourse(id, data);
      set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? updatedCourse : c)),
        selectedCourse:
          state.selectedCourse?.id === id
            ? updatedCourse
            : state.selectedCourse,
        isLoading: false,
      }));
      return updatedCourse;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await coursesApi.deleteCourse(id);
      set((state) => ({
        courses: state.courses.filter((c) => c.id !== id),
        selectedCourse:
          state.selectedCourse?.id === id ? null : state.selectedCourse,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
