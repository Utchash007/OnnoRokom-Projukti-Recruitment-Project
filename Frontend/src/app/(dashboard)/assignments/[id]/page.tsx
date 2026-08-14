"use client";

import React, { useEffect, useState } from "react";
import { useAssignmentStore } from "@/stores/assignment-store";
import { useAuthStore } from "@/stores/auth-store";
import { getMySubmissions } from "@/lib/api/submissions";
import { AssignmentDetail } from "@/components/assignments/AssignmentDetail";
import { Spinner } from "@/components/ui/Spinner";
import type { SubmissionResponse } from "@/types/submission";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const assignmentId = resolvedParams.id;

  const { user } = useAuthStore();
  const { selectedAssignment, isLoading, fetchAssignmentById } =
    useAssignmentStore();
  const [mySubmission, setMySubmission] = useState<SubmissionResponse | null>(
    null
  );

  useEffect(() => {
    fetchAssignmentById(assignmentId);

    if (user?.role === "Student") {
      getMySubmissions()
        .then((subs) => {
          const match = subs.find((s) => s.assignmentId === assignmentId);
          setMySubmission(match || null);
        })
        .catch(() => {});
    }
  }, [assignmentId, user?.role, fetchAssignmentById]);

  if (isLoading && !selectedAssignment) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedAssignment) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Assignment not found.
      </div>
    );
  }

  return (
    <AssignmentDetail
      assignment={selectedAssignment}
      mySubmission={mySubmission}
    />
  );
}
