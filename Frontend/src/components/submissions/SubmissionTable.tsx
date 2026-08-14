"use client";

import React from "react";
import Link from "next/link";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Award, GraduationCap } from "lucide-react";
import type { SubmissionResponse } from "@/types/submission";

export interface SubmissionTableProps {
  submissions: SubmissionResponse[];
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
}) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Student Name</Table.Head>
          <Table.Head>Roll / ID</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Submitted At</Table.Head>
          <Table.Head>Marks Awarded</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {submissions.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6} className="text-center py-8 text-muted-foreground">
              No submissions recorded.
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
              <Table.Cell className="font-semibold">
                {sub.marks !== null ? (
                  <span className="text-success font-bold">{sub.marks} pts</span>
                ) : (
                  <span className="text-muted-foreground/50 text-xs italic">
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
                    View & Grade
                  </Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};
