"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSubmissionStore } from "@/stores/submission-store";
import { getAssignmentById } from "@/lib/api/assignments";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubmissionForm } from "@/components/submissions/SubmissionForm";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  ExternalLink,
  Award,
} from "lucide-react";
import type { AssignmentResponse } from "@/types/assignment";

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const action = searchParams.get("action");

  const { mySubmissions, isLoading, fetchMySubmissions } =
    useSubmissionStore();
  const [activeAssignment, setActiveAssignment] =
    useState<AssignmentResponse | null>(null);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(false);

  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  useEffect(() => {
    if (!assignmentId) {
      setActiveAssignment(null);
      return;
    }

    setIsLoadingAssignment(true);
    getAssignmentById(assignmentId)
      .then((data) => setActiveAssignment(data))
      .catch(() => {})
      .finally(() => setIsLoadingAssignment(false));
  }, [assignmentId]);

  // If user navigated with ?assignmentId=..., show the submission form
  if (assignmentId) {
    if (isLoadingAssignment) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!activeAssignment) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          Assignment not found.
        </div>
      );
    }

    const existingSub = mySubmissions.find(
      (s) => s.assignmentId === assignmentId
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title={
            action === "edit" || existingSub
              ? `Edit Submission: ${activeAssignment.title}`
              : `Submit Assignment: ${activeAssignment.title}`
          }
          description={`${activeAssignment.courseCode} — ${activeAssignment.courseTitle}. Maximum score: ${activeAssignment.maximumMarks} pts.`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Assignments", href: "/assignments" },
            {
              label: activeAssignment.title,
              href: `/assignments/${activeAssignment.id}`,
            },
            { label: existingSub ? "Edit Submission" : "Submit Answer" },
          ]}
        />

        <SubmissionForm
          assignmentId={activeAssignment.id}
          assignmentTitle={activeAssignment.title}
          existingSubmission={existingSub}
        />
      </div>
    );
  }

  // Otherwise, render student's "My Submissions" history
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Submissions"
        description="Track all your submitted assignment deliverables, evaluation grades, and teacher feedback."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Submissions" },
        ]}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : mySubmissions.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7 text-muted-foreground" />}
          title="No Submissions Yet"
          description="You haven't submitted any assignment deliverables yet. Explore your active courses to get started."
          action={
            <Link href="/assignments">
              <Button size="sm">Browse Assignments</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Assignment Task</Table.Head>
                <Table.Head>Submission Status</Table.Head>
                <Table.Head>Submitted On</Table.Head>
                <Table.Head>Score / Evaluation</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {mySubmissions.map((sub) => (
                <Table.Row key={sub.id}>
                  <Table.Cell className="font-semibold text-foreground">
                    <Link
                      href={`/submissions/${sub.id}`}
                      className="hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{sub.assignmentTitle}</span>
                      <ExternalLink className="h-3 w-3 opacity-40" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={sub.status} size="sm" />
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground text-xs">
                    {formatDate(sub.submittedAt)}
                  </Table.Cell>
                  <Table.Cell className="font-semibold">
                    {sub.marks !== null ? (
                      <span className="text-success font-bold flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {sub.marks} pts
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs italic">
                        Pending review
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Link href={`/submissions/${sub.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <SubmissionsContent />
    </Suspense>
  );
}
