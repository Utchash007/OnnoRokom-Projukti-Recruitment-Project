"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssignmentForm } from "@/components/assignments/AssignmentForm";

export default function CreateAssignmentPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Course Assignment"
        description="Draft a new task, set deadline parameters, and publish it to enrolled students."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments", href: "/assignments" },
          { label: "Create" },
        ]}
      />

      <AssignmentForm />
    </div>
  );
}
