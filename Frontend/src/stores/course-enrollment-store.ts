import { create } from "zustand";
import type {
  CourseStudentResponse,
  StudentCourseResponse,
  EnrollStudentsRequest,
  SetCourseEnrollmentStatusRequest,
} from "@/types/course-enrollment";
import * as enrollmentsApi from "@/lib/api/course-enrollments";

interface CourseEnrollmentState {
  courseStudents: CourseStudentResponse[];
  studentCourses: StudentCourseResponse[];
  isLoading: boolean;
  error: string | null;
}

interface CourseEnrollmentActions {
  fetchCourseStudents: (courseId: string) => Promise<void>;
  fetchStudentCourses: (studentId: string) => Promise<void>;
  enrollStudents: (
    data: EnrollStudentsRequest
  ) => Promise<CourseStudentResponse[]>;
  setStatus: (
    enrollmentId: string,
    data: SetCourseEnrollmentStatusRequest
  ) => Promise<void>;
}

export type CourseEnrollmentStore = CourseEnrollmentState &
  CourseEnrollmentActions;

export const useCourseEnrollmentStore = create<CourseEnrollmentStore>(
  (set) => ({
    courseStudents: [],
    studentCourses: [],
    isLoading: false,
    error: null,

    fetchCourseStudents: async (courseId: string) => {
      set({ isLoading: true, error: null });
      try {
        const students = await enrollmentsApi.getCourseStudents(courseId);
        set({ courseStudents: students, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error:
            error?.detail || error?.message || "Failed to fetch course students",
        });
      }
    },

    fetchStudentCourses: async (studentId: string) => {
      set({ isLoading: true, error: null });
      try {
        const courses = await enrollmentsApi.getStudentCourses(studentId);
        set({ studentCourses: courses, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error:
            error?.detail || error?.message || "Failed to fetch student courses",
        });
      }
    },

    enrollStudents: async (data: EnrollStudentsRequest) => {
      set({ isLoading: true });
      try {
        const newEnrollments = await enrollmentsApi.enrollStudents(data);
        set((state) => ({
          courseStudents: [...newEnrollments, ...state.courseStudents],
          isLoading: false,
        }));
        return newEnrollments;
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setStatus: async (
      enrollmentId: string,
      data: SetCourseEnrollmentStatusRequest
    ) => {
      try {
        await enrollmentsApi.setCourseEnrollmentStatus(enrollmentId, data);
        set((state) => ({
          courseStudents: state.courseStudents.map((s) =>
            s.enrollmentId === enrollmentId
              ? { ...s, status: data.status }
              : s
          ),
          studentCourses: state.studentCourses.map((c) =>
            c.enrollmentId === enrollmentId
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
