import { apiClient } from "./client";
import type {
  CourseTeacherResponse,
  TeacherCourseResponse,
  AllocateTeacherRequest,
  SetAllocationStatusRequest,
} from "@/types/teacher-allocation";

export async function getCourseTeachers(
  courseId: string
): Promise<CourseTeacherResponse[]> {
  return apiClient<CourseTeacherResponse[]>(
    `/api/teacher-allocations/courses/${courseId}/teachers`
  );
}

export async function getTeacherCourses(
  teacherId: string
): Promise<TeacherCourseResponse[]> {
  return apiClient<TeacherCourseResponse[]>(
    `/api/teacher-allocations/teachers/${teacherId}/courses`
  );
}

export async function allocateTeacher(
  data: AllocateTeacherRequest
): Promise<CourseTeacherResponse> {
  return apiClient<CourseTeacherResponse>("/api/teacher-allocations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function setAllocationStatus(
  allocationId: string,
  data: SetAllocationStatusRequest
): Promise<void> {
  return apiClient<void>(
    `/api/teacher-allocations/${allocationId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
