"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  Award,
  RotateCcw,
  Send,
  Edit3,
  Trash2,
  Lock,
  ExternalLink,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useAssignmentStore } from "@/stores/assignment-store";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { AssignmentResponse } from "@/types/assignment";

export interface AssignmentCardProps {
  assignment: AssignmentResponse;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
}) => {
  const { user } = useAuthStore();
  const { publishAssignment, closeSubmissions, deleteAssignment } =
    useAssignmentStore();

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      await deleteAssignment(assignment.id);
      toast.success("Assignment deleted successfully");
      setDeleteDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to delete assignment");
      } else {
        toast.error("Failed to delete assignment");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <Card hoverEffect className="flex flex-col justify-between">
        <Card.Content className="p-5 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                {assignment.courseCode}
              </span>
              <StatusBadge status={assignment.status} size="sm" />
              {isClosed && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                  Submissions Closed
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-warning" />
              {assignment.maximumMarks} pts
            </span>
          </div>

          {/* Title and Course */}
          <div>
            <Link
              href={`/assignments/${assignment.id}`}
              className="font-bold text-foreground hover:text-primary transition-colors text-base line-clamp-1 flex items-center gap-1.5"
            >
              <span>{assignment.title}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-40" />
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {assignment.courseTitle}
            </p>
          </div>

          {/* Description preview */}
          {assignment.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {assignment.description}
            </p>
          )}

          {/* Metadata chips */}
          <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span
              className={`flex items-center gap-1.5 font-medium ${
                isDeadlinePassed ? "text-destructive" : ""
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatDate(assignment.deadlineAt)}
            </span>

            <span className="flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              {assignment.allowResubmission
                ? "Resubmissions Allowed"
                : "Single Submission"}
            </span>
          </div>
        </Card.Content>

        {/* Footer actions */}
        <Card.Footer className="p-4 pt-0 flex flex-wrap items-center justify-between gap-2 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
            By {assignment.createdByName}
          </span>

          <div className="flex items-center gap-1.5">
            {isTeacher && (
              <>
                {assignment.status === "Draft" && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setPublishDialogOpen(true)}
                    leftIcon={<Send className="h-3 w-3" />}
                  >
                    Publish
                  </Button>
                )}

                {assignment.status === "Published" && !isClosed && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setCloseDialogOpen(true)}
                    leftIcon={<Lock className="h-3 w-3" />}
                  >
                    Close
                  </Button>
                )}

                <Link href={`/assignments/${assignment.id}/submissions`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    leftIcon={<Users className="h-3 w-3" />}
                  >
                    Submissions
                  </Button>
                </Link>

                <Link href={`/assignments/${assignment.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    title="Edit Assignment"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                  title="Delete Assignment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            {isStudent && (
              <Link href={`/assignments/${assignment.id}`}>
                <Button size="sm" className="h-8 text-xs">
                  View & Submit
                </Button>
              </Link>
            )}

            {user?.role === "Admin" && (
              <Link href={`/assignments/${assignment.id}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Inspect
                </Button>
              </Link>
            )}
          </div>
        </Card.Footer>
      </Card>

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
          message={`Are you sure you want to close submissions for "${assignment.title}"? Students will no longer be able to submit or upload attachments.`}
          confirmLabel="Close Submissions"
          variant="destructive"
          isLoading={isActionLoading}
        />
      )}

      {/* Delete Dialog */}
      {deleteDialogOpen && (
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Assignment"
          message={`Are you sure you want to delete "${assignment.title}"? This soft-deletes the task while preserving existing student records.`}
          confirmLabel="Delete Assignment"
          variant="destructive"
          isLoading={isActionLoading}
        />
      )}
    </>
  );
};
