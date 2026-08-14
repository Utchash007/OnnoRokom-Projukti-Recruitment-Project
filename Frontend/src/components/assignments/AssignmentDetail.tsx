"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useAssignmentStore } from "@/stores/assignment-store";
import {
  Clock,
  Award,
  RotateCcw,
  Send,
  Lock,
  Edit3,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { AssignmentResponse } from "@/types/assignment";
import type { SubmissionResponse } from "@/types/submission";

export interface AssignmentDetailProps {
  assignment: AssignmentResponse;
  mySubmission?: SubmissionResponse | null;
}

export const AssignmentDetail: React.FC<AssignmentDetailProps> = ({
  assignment,
  mySubmission,
}) => {
  const { user } = useAuthStore();
  const { publishAssignment, closeSubmissions } = useAssignmentStore();

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isTeacher = user?.role === "Teacher";
  const isStudent = user?.role === "Student";
  const isClosed = !!assignment.submissionsClosedAt;
  const isDeadlinePassed = new Date(assignment.deadlineAt) < new Date();

  const handlePublish = async () => {
    setIsActionLoading(true);
    try {
      await publishAssignment(assignment.id);
      toast.success("Assignment published successfully!");
      setPublishDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to publish assignment");
      } else {
        toast.error("Failed to publish assignment");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloseSubmissions = async () => {
    setIsActionLoading(true);
    try {
      await closeSubmissions(assignment.id);
      toast.success("Submissions closed for this assignment");
      setCloseDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to close submissions");
      } else {
        toast.error("Failed to close submissions");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={assignment.title}
        description={`${assignment.courseCode} — ${assignment.courseTitle}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments", href: "/assignments" },
          { label: assignment.title },
        ]}
        action={
          <div className="flex items-center gap-2">
            {isTeacher && (
              <>
                {assignment.status === "Draft" && (
                  <Button
                    size="sm"
                    onClick={() => setPublishDialogOpen(true)}
                    leftIcon={<Send className="h-4 w-4" />}
                  >
                    Publish Assignment
                  </Button>
                )}

                {assignment.status === "Published" && !isClosed && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setCloseDialogOpen(true)}
                    leftIcon={<Lock className="h-4 w-4" />}
                  >
                    Close Submissions
                  </Button>
                )}

                <Link href={`/assignments/${assignment.id}/submissions`}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Users className="h-4 w-4" />}
                  >
                    View Submissions
                  </Button>
                </Link>

                <Link href={`/assignments/${assignment.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                </Link>
              </>
            )}
          </div>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title className="text-base">Task Instructions</Card.Title>
                <div className="flex items-center gap-2">
                  <StatusBadge status={assignment.status} size="sm" />
                  {isClosed && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                      Submissions Closed
                    </span>
                  )}
                </div>
              </div>
            </Card.Header>

            <Card.Content className="p-6">
              {assignment.description ? (
                <div className="prose dark:prose-invert max-w-none text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {assignment.description}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No additional written instructions provided for this assignment.
                </p>
              )}
            </Card.Content>
          </Card>

          {/* Student Submission Action Section */}
          {isStudent && (
            <Card className="border-primary/30 shadow-md">
              <Card.Header className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <Card.Title className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    My Submission Status
                  </Card.Title>
                  {mySubmission ? (
                    <StatusBadge status={mySubmission.status} size="md" />
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warning/15 text-warning-foreground border border-warning/30">
                      Pending Submission
                    </span>
                  )}
                </div>
              </Card.Header>

              <Card.Content className="p-6 space-y-4">
                {mySubmission ? (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      You submitted this assignment on{" "}
                      <span className="font-semibold">
                        {formatDate(mySubmission.submittedAt)}
                      </span>
                      .
                    </p>

                    {mySubmission.marks !== null && (
                      <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-success uppercase">
                            Evaluated Score
                          </p>
                          <p className="text-xl font-extrabold text-foreground mt-0.5">
                            {mySubmission.marks} / {assignment.maximumMarks} pts
                          </p>
                        </div>
                        {mySubmission.evaluatedByName && (
                          <span className="text-xs text-muted-foreground">
                            Graded by {mySubmission.evaluatedByName}
                          </span>
                        )}
                      </div>
                    )}

                    {mySubmission.feedback && (
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                          Instructor Feedback
                        </p>
                        <p className="text-sm text-foreground">
                          {mySubmission.feedback}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-3">
                      <Link href={`/submissions/${mySubmission.id}`}>
                        <Button size="sm" variant="outline">
                          View Complete Submission
                        </Button>
                      </Link>

                      {assignment.allowResubmission && !isClosed && (
                        <Link href={`/submissions/${mySubmission.id}`}>
                          <Button size="sm" variant="secondary">
                            Resubmit Work
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : isClosed ? (
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Submissions for this assignment have been closed by the instructor.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You have not submitted an answer for this assignment yet. Deliver your written text or upload attachment files before the deadline.
                    </p>
                    <Link href={`/submissions?assignmentId=${assignment.id}&action=submit`}>
                      <Button size="md" className="font-semibold shadow-sm">
                        Start Submission
                      </Button>
                    </Link>
                  </div>
                )}
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Metadata Sidebar */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="text-sm">Assignment Parameters</Card.Title>
            </Card.Header>
            <Card.Content className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-warning" /> Maximum Points
                </span>
                <span className="font-bold text-foreground text-sm">
                  {assignment.maximumMarks} pts
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Deadline Date
                </span>
                <span
                  className={`font-semibold ${
                    isDeadlinePassed ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {formatDate(assignment.deadlineAt)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-accent-foreground" /> Resubmissions
                </span>
                <span className="font-semibold text-foreground">
                  {assignment.allowResubmission ? "Allowed" : "Single Attempt"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Author Faculty</span>
                <span className="font-semibold text-foreground">
                  {assignment.createdByName}
                </span>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Publish Dialog */}
      {publishDialogOpen && (
        <ConfirmDialog
          isOpen={publishDialogOpen}
          onClose={() => setPublishDialogOpen(false)}
          onConfirm={handlePublish}
          title="Publish Assignment"
          message={`Are you sure you want to publish "${assignment.title}"? Enrolled students will immediately see this task and can start submitting answers.`}
          confirmLabel="Publish Now"
          variant="primary"
          isLoading={isActionLoading}
        />
      )}

      {/* Close Submissions Dialog */}
      {closeDialogOpen && (
        <ConfirmDialog
          isOpen={closeDialogOpen}
          onClose={() => setCloseDialogOpen(false)}
          onConfirm={handleCloseSubmissions}
          title="Close Submissions"
          message={`Are you sure you want to close submissions for "${assignment.title}"?`}
          confirmLabel="Close Submissions"
          variant="destructive"
          isLoading={isActionLoading}
        />
      )}
    </div>
  );
};
