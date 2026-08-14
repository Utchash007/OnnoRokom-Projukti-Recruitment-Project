import type { EnrollmentStatus } from "./enums";

export interface EnrollStudentsRequest {
  courseId: string;
  batchEnrollmentIds: string[];
}

export interface SetCourseEnrollmentStatusRequest {
  status: EnrollmentStatus;
}

export interface CourseStudentResponse {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentRoll: string | null;
  batchCode: string;
  status: EnrollmentStatus;
}

export interface StudentCourseResponse {
  enrollmentId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  status: EnrollmentStatus;
}
