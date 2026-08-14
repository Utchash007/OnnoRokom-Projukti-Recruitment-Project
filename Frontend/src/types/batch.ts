import type { EnrollmentStatus } from "./enums";

export interface BatchResponse {
  id: string;
  termId: string;
  termCode: string;
  code: string;
  name: string;
}

export interface CreateBatchRequest {
  termId: string;
  code: string;
  name: string;
}

export interface UpdateBatchRequest {
  code: string;
  name: string;
}

export interface AssignStudentRequest {
  studentId: string;
}

export interface SetBatchEnrollmentStatusRequest {
  status: EnrollmentStatus;
}

export interface BatchStudentResponse {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string | null;
  status: EnrollmentStatus;
}
