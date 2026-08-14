import { apiClient } from "./client";
import type {
  CourseResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";

export async function getCourses(): Promise<CourseResponse[]> {
  return apiClient<CourseResponse[]>("/api/courses");
}

export async function getCourseById(id: string): Promise<CourseResponse> {
  return apiClient<CourseResponse>(`/api/courses/${id}`);
}

export async function createCourse(
  data: CreateCourseRequest
): Promise<CourseResponse> {
  return apiClient<CourseResponse>("/api/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCourse(
  id: string,
  data: UpdateCourseRequest
): Promise<CourseResponse> {
  return apiClient<CourseResponse>(`/api/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(id: string): Promise<void> {
  return apiClient<void>(`/api/courses/${id}`, {
    method: "DELETE",
  });
}
