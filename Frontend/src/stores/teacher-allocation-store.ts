import { create } from "zustand";
import type {
  CourseTeacherResponse,
  TeacherCourseResponse,
  AllocateTeacherRequest,
  SetAllocationStatusRequest,
} from "@/types/teacher-allocation";
import * as allocationsApi from "@/lib/api/teacher-allocations";

interface TeacherAllocationState {
  courseTeachers: CourseTeacherResponse[];
  teacherCourses: TeacherCourseResponse[];
  isLoading: boolean;
  error: string | null;
}

interface TeacherAllocationActions {
  fetchCourseTeachers: (courseId: string) => Promise<void>;
  fetchTeacherCourses: (teacherId: string) => Promise<void>;
  allocateTeacher: (
    data: AllocateTeacherRequest
  ) => Promise<CourseTeacherResponse>;
  setStatus: (
    allocationId: string,
    data: SetAllocationStatusRequest
  ) => Promise<void>;
}

export type TeacherAllocationStore = TeacherAllocationState &
  TeacherAllocationActions;

export const useTeacherAllocationStore = create<TeacherAllocationStore>(
  (set) => ({
    courseTeachers: [],
    teacherCourses: [],
    isLoading: false,
    error: null,

    fetchCourseTeachers: async (courseId: string) => {
      set({ isLoading: true, error: null });
      try {
        const teachers = await allocationsApi.getCourseTeachers(courseId);
        set({ courseTeachers: teachers, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error:
            error?.detail || error?.message || "Failed to fetch course teachers",
        });
      }
    },

    fetchTeacherCourses: async (teacherId: string) => {
      set({ isLoading: true, error: null });
      try {
        const courses = await allocationsApi.getTeacherCourses(teacherId);
        set({ teacherCourses: courses, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error:
            error?.detail || error?.message || "Failed to fetch teacher courses",
        });
      }
    },

    allocateTeacher: async (data: AllocateTeacherRequest) => {
      set({ isLoading: true });
      try {
        const res = await allocationsApi.allocateTeacher(data);
        set((state) => ({
          courseTeachers: [res, ...state.courseTeachers],
          isLoading: false,
        }));
        return res;
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setStatus: async (
      allocationId: string,
      data: SetAllocationStatusRequest
    ) => {
      try {
        await allocationsApi.setAllocationStatus(allocationId, data);
        set((state) => ({
          courseTeachers: state.courseTeachers.map((t) =>
            t.allocationId === allocationId
              ? { ...t, status: data.status }
              : t
          ),
          teacherCourses: state.teacherCourses.map((c) =>
            c.allocationId === allocationId
              ? { ...c, status: data.status }
              : c
          ),
        }));
      } catch (error) {
        throw error;
      }
    },
  })
);
