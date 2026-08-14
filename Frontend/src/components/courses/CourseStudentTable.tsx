"use client";

import React, { useState } from "react";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCourseEnrollmentStore } from "@/stores/course-enrollment-store";
import { UserCheck, UserX, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { CourseStudentResponse } from "@/types/course-enrollment";

export interface CourseStudentTableProps {
  students: CourseStudentResponse[];
}

export const CourseStudentTable: React.FC<CourseStudentTableProps> = ({
  students,
}) => {
  const setStatus = useCourseEnrollmentStore((state) => state.setStatus);
  const [toggleStudent, setToggleStudent] =
    useState<CourseStudentResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    if (!toggleStudent) return;
    const newStatus =
      toggleStudent.status === "Active" ? "Inactive" : "Active";

    setIsUpdating(true);
    try {
      await setStatus(toggleStudent.enrollmentId, {
        status: newStatus,
      });
      toast.success(
        `${toggleStudent.studentName}'s course enrollment set to ${newStatus}`
      );
      setToggleStudent(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to update enrollment status");
      } else {
        toast.error("Failed to update student course enrollment status");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Student Name</Table.Head>
            <Table.Head>Roll / ID</Table.Head>
            <Table.Head>Source Batch</Table.Head>
            <Table.Head>Course Enrollment Status</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-8 text-muted-foreground">
                No students enrolled in this course yet. Use &quot;Enroll Students&quot; to add batch members.
              </Table.Cell>
            </Table.Row>
          ) : (
            students.map((item) => (
              <Table.Row key={item.enrollmentId}>
                <Table.Cell className="font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>{item.studentName}</span>
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {item.studentRoll || <span className="text-muted-foreground/40">—</span>}
                </Table.Cell>
                <Table.Cell>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                    {item.batchCode}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={item.status} size="sm" />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    variant={item.status === "Active" ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => setToggleStudent(item)}
                    className={
                      item.status === "Active"
                        ? "text-destructive hover:bg-destructive/10 text-xs h-8"
                        : "text-success hover:bg-success/10 border-success/30 text-xs h-8"
                    }
                    leftIcon={
                      item.status === "Active" ? (
                        <UserX className="h-3.5 w-3.5" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )
                    }
                  >
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Confirmation Dialog */}
      {toggleStudent && (
        <ConfirmDialog
          isOpen={!!toggleStudent}
          onClose={() => setToggleStudent(null)}
          onConfirm={handleToggleStatus}
          title={
            toggleStudent.status === "Active"
              ? "Deactivate Course Enrollment"
              : "Activate Course Enrollment"
          }
          message={`Are you sure you want to change ${toggleStudent.studentName}'s course enrollment to ${
            toggleStudent.status === "Active" ? "Inactive" : "Active"
          }?`}
          confirmLabel={
            toggleStudent.status === "Active" ? "Deactivate" : "Activate"
          }
          variant={toggleStudent.status === "Active" ? "destructive" : "primary"}
          isLoading={isUpdating}
        />
      )}
    </>
  );
};
