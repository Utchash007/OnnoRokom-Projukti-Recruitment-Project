"use client";

import React, { useEffect, useState } from "react";
import { useCourseStore } from "@/stores/course-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseFormModal } from "@/components/courses/CourseFormModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { PlusCircle } from "lucide-react";
import type { CourseResponse } from "@/types/course";

export default function CoursesPage() {
  const { courses, isLoading, fetchCourses } = useCourseStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseResponse | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEdit = (course: CourseResponse) => {
    setEditCourse(course);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditCourse(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Course Catalog"
        description="Maintain academic subject listings, manage student enrollments, and allocate teaching faculty."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses" },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create Course
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <CourseTable courses={courses} onEdit={handleEdit} />
      )}

      {modalOpen && (
        <CourseFormModal
          isOpen={modalOpen}
          onClose={handleClose}
          initialData={editCourse}
        />
      )}
    </div>
  );
}
