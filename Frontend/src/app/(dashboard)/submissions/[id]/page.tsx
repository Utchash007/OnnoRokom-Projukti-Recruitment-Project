"use client";

import React, { useEffect, useState } from "react";
import { useSubmissionStore } from "@/stores/submission-store";
import { getAssignmentById } from "@/lib/api/assignments";
import { SubmissionDetail } from "@/components/submissions/SubmissionDetail";
import { Spinner } from "@/components/ui/Spinner";
import type { AssignmentResponse } from "@/types/assignment";

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const submissionId = resolvedParams.id;

  const {
    selectedSubmission,
    isLoading: isSubmissionLoading,
    fetchSubmissionById,
  } = useSubmissionStore();
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(
    null
  );

  useEffect(() => {
    fetchSubmissionById(submissionId);
  }, [submissionId, fetchSubmissionById]);

  useEffect(() => {
    if (!selectedSubmission?.assignmentId) return;

    getAssignmentById(selectedSubmission.assignmentId)
      .then((data) => setAssignment(data))
      .catch(() => {});
  }, [selectedSubmission?.assignmentId]);

  if (isSubmissionLoading && !selectedSubmission) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedSubmission) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Submission not found.
      </div>
    );
  }

  return (
    <SubmissionDetail
      submission={selectedSubmission}
      assignment={assignment}
    />
  );
}
