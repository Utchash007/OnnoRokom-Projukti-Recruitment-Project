"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { AttachmentList } from "./AttachmentList";
import { ReviewForm } from "./ReviewForm";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import {
  FileText,
  GraduationCap,
  Clock,
  Award,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import type { SubmissionResponse } from "@/types/submission";
import type { AssignmentResponse } from "@/types/assignment";

export interface SubmissionDetailProps {
  submission: SubmissionResponse;
  assignment?: AssignmentResponse | null;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({
  submission: initialSubmission,
  assignment,
}) => {
  const { user } = useAuthStore();
  const [submission, setSubmission] = useState<SubmissionResponse>(
    initialSubmission
  );

  const isTeacher = user?.role === "Teacher";
  const isStudent = user?.role === "Student";
  const maxMarks = assignment?.maximumMarks ?? 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Submission: ${submission.assignmentTitle}`}
        description={`Submitted by ${submission.studentName} on ${formatDate(
          submission.submittedAt
        )}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments", href: "/assignments" },
          {
            label: submission.assignmentTitle,
            href: `/assignments/${submission.assignmentId}`,
          },
          { label: "Submission Detail" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/assignments/${submission.assignmentId}`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Assignment Task
              </Button>
            </Link>

            {isStudent && assignment?.allowResubmission && !assignment.submissionsClosedAt && (
              <Link
                href={`/submissions?assignmentId=${submission.assignmentId}&action=edit`}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Edit Answer
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Answer Text & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evaluation Banner if Graded */}
          {submission.marks !== null && (
            <Card className="border-success/30 bg-success/5 shadow-xs">
              <Card.Content className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-success" />
                    <div>
                      <p className="text-xs font-bold text-success uppercase">
                        Evaluation Result
                      </p>
                      <h3 className="text-2xl font-extrabold text-foreground">
                        {submission.marks} / {maxMarks} pts
                      </h3>
                    </div>
                  </div>
                  <StatusBadge status={submission.status} size="md" />
                </div>

                {submission.feedback && (
                  <div className="pt-3 border-t border-success/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Instructor Feedback
                    </p>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {submission.evaluatedByName && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Graded by {submission.evaluatedByName}
                  </p>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Student's Written Answer */}
          <Card>
            <Card.Header>
              <Card.Title className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Written Answer Deliverable
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6">
              {submission.answerText ? (
                <div className="prose dark:prose-invert max-w-none text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {submission.answerText}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No written answer text submitted. See uploaded attachments below.
                </p>
              )}
            </Card.Content>
          </Card>

          {/* Uploaded Attachments */}
          <Card>
            <Card.Header>
              <Card.Title className="text-base">
                Attached Files ({submission.attachments?.length || 0})
              </Card.Title>
              <Card.Description>
                Download and inspect submitted file deliverables.
              </Card.Description>
            </Card.Header>
            <Card.Content className="p-6">
              <AttachmentList
                attachments={submission.attachments || []}
                canDelete={false}
              />
            </Card.Content>
          </Card>

          {/* Teacher Grading Panel */}
          {isTeacher && (
            <ReviewForm
              submission={submission}
              maximumMarks={maxMarks}
              onReviewed={(updated) => setSubmission(updated)}
            />
          )}
        </div>

        {/* Right 1 Column: Submission Metadata */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="text-sm">Student Information</Card.Title>
            </Card.Header>
            <Card.Content className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    {submission.studentName}
                  </p>
                  <p className="text-muted-foreground">
                    Roll: {submission.studentRoll || "None assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={submission.status} size="sm" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Submitted At
                </span>
                <span className="font-semibold text-foreground">
                  {formatDate(submission.submittedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assignment</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {submission.assignmentTitle}
                </span>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};
