export interface CourseResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
}

export interface CreateCourseRequest {
  code: string;
  title: string;
  description?: string | null;
}

export interface UpdateCourseRequest {
  code: string;
  title: string;
  description?: string | null;
}
