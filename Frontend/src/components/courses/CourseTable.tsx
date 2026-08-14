"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit3, Trash2, BookOpen, ExternalLink, SlidersHorizontal } from "lucide-react";
import { useCourseStore } from "@/stores/course-store";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { CourseResponse } from "@/types/course";

export interface CourseTableProps {
  courses: CourseResponse[];
  onEdit: (course: CourseResponse) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEdit,
}) => {
  const deleteCourse = useCourseStore((state) => state.deleteCourse);
  const [deleteTarget, setDeleteTarget] = useState<CourseResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCourse(deleteTarget.id);
      toast.success(`Course "${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to delete course");
      } else {
        toast.error(
          "Cannot delete course with active student enrollments, teacher allocations, or assignments."
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Course Code</Table.Head>
            <Table.Head>Title</Table.Head>
            <Table.Head>Description</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courses.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-8 text-muted-foreground">
                No courses cataloged yet.
              </Table.Cell>
            </Table.Row>
          ) : (
            courses.map((course) => (
              <Table.Row key={course.id}>
                <Table.Cell className="font-semibold text-foreground">
                  <Link
                    href={`/courses/${course.id}`}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="h-4 w-4 text-success" />
                    <span>{course.code}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </Link>
                </Table.Cell>
                <Table.Cell className="font-medium text-foreground">
                  {course.title}
                </Table.Cell>
                <Table.Cell className="text-muted-foreground max-w-xs truncate">
                  {course.description || <span className="text-muted-foreground/40">—</span>}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/courses/${course.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                      >
                        Manage
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(course)}
                      className="h-8 px-2 text-xs"
                      title="Edit Course"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(course)}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                      title="Delete Course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Course Subject"
          message={`Are you sure you want to delete course "${deleteTarget.title}" (${deleteTarget.code})? This will fail if allocations or assignments are active.`}
          confirmLabel="Delete Course"
          variant="destructive"
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
