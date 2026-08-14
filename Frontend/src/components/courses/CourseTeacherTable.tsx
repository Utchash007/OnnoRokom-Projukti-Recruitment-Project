"use client";

import React, { useState } from "react";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTeacherAllocationStore } from "@/stores/teacher-allocation-store";
import { UserCheck, UserX, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { CourseTeacherResponse } from "@/types/teacher-allocation";

export interface CourseTeacherTableProps {
  teachers: CourseTeacherResponse[];
}

export const CourseTeacherTable: React.FC<CourseTeacherTableProps> = ({
  teachers,
}) => {
  const setStatus = useTeacherAllocationStore((state) => state.setStatus);
  const [toggleTeacher, setToggleTeacher] =
    useState<CourseTeacherResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    if (!toggleTeacher) return;
    const newStatus =
      toggleTeacher.status === "Active" ? "Inactive" : "Active";

    setIsUpdating(true);
    try {
      await setStatus(toggleTeacher.allocationId, {
        status: newStatus,
      });
      toast.success(
        `${toggleTeacher.teacherName}'s allocation set to ${newStatus}`
      );
      setToggleTeacher(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to update allocation status");
      } else {
        toast.error("Failed to update teacher allocation status");
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
            <Table.Head>Teacher Name</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Allocation Status</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teachers.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-8 text-muted-foreground">
                No instructors allocated to this course yet. Use &quot;Allocate Teacher&quot; to assign teaching faculty.
              </Table.Cell>
            </Table.Row>
          ) : (
            teachers.map((item) => (
              <Table.Row key={item.allocationId}>
                <Table.Cell className="font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{item.teacherName}</span>
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {item.teacherEmail}
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={item.status} size="sm" />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    variant={item.status === "Active" ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => setToggleTeacher(item)}
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
      {toggleTeacher && (
        <ConfirmDialog
          isOpen={!!toggleTeacher}
          onClose={() => setToggleTeacher(null)}
          onConfirm={handleToggleStatus}
          title={
            toggleTeacher.status === "Active"
              ? "Deactivate Teacher Allocation"
              : "Activate Teacher Allocation"
          }
          message={`Are you sure you want to change ${toggleTeacher.teacherName}'s course allocation to ${
            toggleTeacher.status === "Active" ? "Inactive" : "Active"
          }? ${
            toggleTeacher.status === "Active"
              ? "They will no longer be able to create assignments or grade for this course."
              : "They will gain access to manage course assignments and submissions."
          }`}
          confirmLabel={
            toggleTeacher.status === "Active" ? "Deactivate" : "Activate"
          }
          variant={toggleTeacher.status === "Active" ? "destructive" : "primary"}
          isLoading={isUpdating}
        />
      )}
    </>
  );
};
