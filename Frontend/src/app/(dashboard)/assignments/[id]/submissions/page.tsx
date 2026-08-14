"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAssignmentStore } from "@/stores/assignment-store";
import { getAssignmentSubmissions } from "@/lib/api/submissions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  ArrowLeft,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import type { SubmissionResponse } from "@/types/submission";

export default function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const assignmentId = resolvedParams.id;

  const { selectedAssignment, isLoading: isAssignmentLoading, fetchAssignmentById } =
    useAssignmentStore();
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  useEffect(() => {
    fetchAssignmentById(assignmentId);

    getAssignmentSubmissions(assignmentId)
      .then((data) => setSubmissions(data))
      .catch(() => {})
      .finally(() => setIsLoadingSubmissions(false));
  }, [assignmentId, fetchAssignmentById]);

  if (isAssignmentLoading && !selectedAssignment) {
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

  const reviewedCount = submissions.filter((s) => s.status === "Reviewed").length;
  const lateCount = submissions.filter((s) => s.status === "Late").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Submissions: ${selectedAssignment.title}`}
        description={`Review student deliverables, evaluate scores, and provide feedback for ${selectedAssignment.courseCode}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments", href: "/assignments" },
          {
            label: selectedAssignment.title,
            href: `/assignments/${selectedAssignment.id}`,
          },
          { label: "Submissions" },
        ]}
        action={
          <Link href={`/assignments/${selectedAssignment.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Assignment Details
            </Button>
          </Link>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Submissions
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {submissions.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Delivered answers
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Evaluated / Graded
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {reviewedCount} / {submissions.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Scored submissions
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Late Submissions
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {lateCount}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Past deadline
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground">
              <Clock className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Submissions Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Student Deliverables Roster
        </h3>

        {isLoadingSubmissions ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Student Name</Table.Head>
                <Table.Head>Roll / ID</Table.Head>
                <Table.Head>Submission Status</Table.Head>
                <Table.Head>Submitted At</Table.Head>
                <Table.Head>Score / Max</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {submissions.length === 0 ? (
                <Table.Row>
                  <Table.Cell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No students have submitted deliverables for this assignment yet.
                  </Table.Cell>
                </Table.Row>
              ) : (
                submissions.map((sub) => (
                  <Table.Row key={sub.id}>
                    <Table.Cell className="font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>{sub.studentName}</span>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      {sub.studentRoll || <span className="text-muted-foreground/40">—</span>}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={sub.status} size="sm" />
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground text-xs">
                      {formatDate(sub.submittedAt)}
                    </Table.Cell>
                    <Table.Cell className="font-semibold text-foreground">
                      {sub.marks !== null ? (
                        <span className="text-success font-bold">
                          {sub.marks} / {selectedAssignment.maximumMarks}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          Not graded
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <Link href={`/submissions/${sub.id}`}>
                        <Button
                          size="sm"
                          variant="primary"
                          className="h-8 text-xs font-semibold"
                          leftIcon={<Award className="h-3.5 w-3.5" />}
                        >
                          Review & Grade
                        </Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}
