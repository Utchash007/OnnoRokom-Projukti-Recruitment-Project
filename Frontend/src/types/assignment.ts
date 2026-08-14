import type { AssignmentStatus } from "./enums";

export interface AssignmentResponse {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string | null;
  deadlineAt: string;
  maximumMarks: number;
  status: AssignmentStatus;
  allowResubmission: boolean;
  submissionsClosedAt: string | null;
  createdByUserId: string;
  createdByName: string;
}

export interface CreateAssignmentRequest {
  courseId: string;
  title: string;
  description?: string | null;
  deadlineAt: string;
  maximumMarks: number;
  allowResubmission: boolean;
}

export interface UpdateAssignmentRequest {
  title: string;
  description?: string | null;
  deadlineAt: string;
  maximumMarks: number;
  allowResubmission: boolean;
}
