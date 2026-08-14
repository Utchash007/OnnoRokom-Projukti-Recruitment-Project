import type { SubmissionStatus } from "./enums";
import type { AttachmentResponse } from "./submission-attachment";

export interface SubmissionResponse {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentRoll: string | null;
  answerText: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  marks: number | null;
  feedback: string | null;
  evaluatedByUserId: string | null;
  evaluatedByName: string | null;
  attachments: AttachmentResponse[];
}

export interface UpsertSubmissionRequest {
  answerText?: string | null;
}

export interface ReviewSubmissionRequest {
  marks: number;
  feedback?: string | null;
  status: SubmissionStatus;
}
