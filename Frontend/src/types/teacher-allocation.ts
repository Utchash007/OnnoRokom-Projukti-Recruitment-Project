import type { TeacherCourseAllocationStatus } from "./enums";

export interface AllocateTeacherRequest {
  teacherId: string;
  courseId: string;
}

export interface SetAllocationStatusRequest {
  status: TeacherCourseAllocationStatus;
}

export interface CourseTeacherResponse {
  allocationId: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  status: TeacherCourseAllocationStatus;
}

export interface TeacherCourseResponse {
  allocationId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  status: TeacherCourseAllocationStatus;
}
