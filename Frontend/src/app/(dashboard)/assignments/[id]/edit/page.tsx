"use client";

import React, { useEffect } from "react";
import { useAssignmentStore } from "@/stores/assignment-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssignmentForm } from "@/components/assignments/AssignmentForm";
import { Spinner } from "@/components/ui/Spinner";

export default function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const assignmentId = resolvedParams.id;
  const { selectedAssignment, isLoading, fetchAssignmentById } =
    useAssignmentStore();

  useEffect(() => {
    fetchAssignmentById(assignmentId);
  }, [assignmentId, fetchAssignmentById]);

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
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Edit: ${selectedAssignment.title}`}
        description={`Update instructions, maximum points, or deadline for ${selectedAssignment.courseCode}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments", href: "/assignments" },
          {
            label: selectedAssignment.title,
            href: `/assignments/${selectedAssignment.id}`,
          },
          { label: "Edit" },
        ]}
      />

      <AssignmentForm initialData={selectedAssignment} />
    </div>
  );
}
