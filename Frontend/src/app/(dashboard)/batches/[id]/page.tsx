"use client";

import React, { useEffect, useState } from "react";
import { useBatchStore } from "@/stores/batch-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { BatchStudentTable } from "@/components/batches/BatchStudentTable";
import { AssignStudentModal } from "@/components/batches/AssignStudentModal";
import { UserPlus, Layers, Calendar, Users } from "lucide-react";

export default function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const batchId = resolvedParams.id;
  const {
    selectedBatch,
    batchStudents,
    isLoading,
    isStudentsLoading,
    fetchBatchById,
    fetchBatchStudents,
  } = useBatchStore();

  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    fetchBatchById(batchId);
    fetchBatchStudents(batchId);
  }, [batchId, fetchBatchById, fetchBatchStudents]);

  if (isLoading && !selectedBatch) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedBatch) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Batch not found.</p>
      </div>
    );
  }

  const activeStudentsCount = batchStudents.filter(
    (s) => s.status === "Active"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={selectedBatch.name}
        description={`Manage students enrolled in cohort ${selectedBatch.code}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Batches", href: "/batches" },
          { label: selectedBatch.code },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setAssignModalOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Assign Student
          </Button>
        }
      />

      {/* Batch Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Batch Code
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {selectedBatch.code}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Identifier
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Academic Term
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {selectedBatch.termCode}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Associated Period
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground">
              <Calendar className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Enrolled Students
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {batchStudents.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeStudentsCount} Active members
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <Users className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Enrolled Students List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Batch Student Roster
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            Total {batchStudents.length} Students
          </span>
        </div>

        {isStudentsLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <BatchStudentTable
            batchId={selectedBatch.id}
            students={batchStudents}
          />
        )}
      </div>

      {/* Assign Student Modal */}
      {assignModalOpen && (
        <AssignStudentModal
          batchId={selectedBatch.id}
          batchName={selectedBatch.name}
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          alreadyEnrolledStudentIds={batchStudents.map((s) => s.studentId)}
        />
      )}
    </div>
  );
}
