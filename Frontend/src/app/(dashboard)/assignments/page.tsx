"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAssignmentStore } from "@/stores/assignment-store";
import { useAuthStore } from "@/stores/auth-store";
import { getCourses } from "@/lib/api/courses";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssignmentList } from "@/components/assignments/AssignmentList";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { PlusCircle } from "lucide-react";
import type { CourseResponse } from "@/types/course";

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  const { assignments, isLoading, fetchAssignments } = useAssignmentStore();
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  const isTeacher = user?.role === "Teacher";

  useEffect(() => {
    fetchAssignments();
    getCourses()
      .then((data) => setCourses(data))
      .catch(() => {});
  }, [fetchAssignments]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Course Assignments"
        description="Explore course assignments, upcoming submission deadlines, and task deliverables."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments" },
        ]}
        action={
          isTeacher ? (
            <Link href="/assignments/create">
              <Button
                size="sm"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Create Assignment
              </Button>
            </Link>
          ) : null
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <AssignmentList assignments={assignments} courses={courses} />
      )}
    </div>
  );
}
