import { apiClient } from "./client";
import type {
  CourseStudentResponse,
  StudentCourseResponse,
  EnrollStudentsRequest,
  SetCourseEnrollmentStatusRequest,
} from "@/types/course-enrollment";

export async function getCourseStudents(
  courseId: string
): Promise<CourseStudentResponse[]> {
  return apiClient<CourseStudentResponse[]>(
    `/api/course-enrollments/courses/${courseId}/students`
  );
}

export async function getStudentCourses(
  studentId: string
): Promise<StudentCourseResponse[]> {
  return apiClient<StudentCourseResponse[]>(
    `/api/course-enrollments/students/${studentId}/courses`
  );
}

export async function enrollStudents(
  data: EnrollStudentsRequest
): Promise<CourseStudentResponse[]> {
  return apiClient<CourseStudentResponse[]>("/api/course-enrollments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function setCourseEnrollmentStatus(
  enrollmentId: string,
  data: SetCourseEnrollmentStatusRequest
): Promise<void> {
  return apiClient<void>(
    `/api/course-enrollments/${enrollmentId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
