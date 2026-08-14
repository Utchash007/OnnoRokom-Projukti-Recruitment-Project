"use client";

import React, { useEffect, useState } from "react";
import { useCourseStore } from "@/stores/course-store";
import { useCourseEnrollmentStore } from "@/stores/course-enrollment-store";
import { useTeacherAllocationStore } from "@/stores/teacher-allocation-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CourseStudentTable } from "@/components/courses/CourseStudentTable";
import { CourseTeacherTable } from "@/components/courses/CourseTeacherTable";
import { EnrollStudentsModal } from "@/components/courses/EnrollStudentsModal";
import { AllocateTeacherModal } from "@/components/courses/AllocateTeacherModal";
import {
  BookOpen,
  GraduationCap,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const courseId = resolvedParams.id;

  const { selectedCourse, isLoading: isCourseLoading, fetchCourseById } =
    useCourseStore();
  const {
    courseStudents,
    isLoading: isStudentsLoading,
    fetchCourseStudents,
  } = useCourseEnrollmentStore();
  const {
    courseTeachers,
    isLoading: isTeachersLoading,
    fetchCourseTeachers,
  } = useTeacherAllocationStore();

  const [activeTab, setActiveTab] = useState<"students" | "teachers">(
    "students"
  );
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);

  useEffect(() => {
    fetchCourseById(courseId);
    fetchCourseStudents(courseId);
    fetchCourseTeachers(courseId);
  }, [courseId, fetchCourseById, fetchCourseStudents, fetchCourseTeachers]);

  if (isCourseLoading && !selectedCourse) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  const activeStudentsCount = courseStudents.filter(
    (s) => s.status === "Active"
  ).length;
  const activeTeachersCount = courseTeachers.filter(
    (t) => t.status === "Active"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`${selectedCourse.code} — ${selectedCourse.title}`}
        description={
          selectedCourse.description ||
          "Manage student batch enrollments and teaching allocations for this course."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/courses" },
          { label: selectedCourse.code },
        ]}
        action={
          activeTab === "students" ? (
            <Button
              size="sm"
              onClick={() => setEnrollModalOpen(true)}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Enroll Students
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setAllocateModalOpen(true)}
              leftIcon={<UserCheck className="h-4 w-4" />}
            >
              Allocate Teacher
            </Button>
          )
        }
      />

      {/* Course Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Course Code
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {selectedCourse.code}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Catalog Symbol
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
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
                {courseStudents.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeStudentsCount} Active participants
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Teaching Faculty
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {courseTeachers.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeTeachersCount} Active instructors
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Users className="h-5 w-5" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "students"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Enrolled Students ({courseStudents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("teachers")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "teachers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Instructors ({courseTeachers.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "students" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Course Student Roster
            </h3>
            <span className="text-xs text-muted-foreground">
              Students receive all published assignments for this course
            </span>
          </div>

          {isStudentsLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : (
            <CourseStudentTable students={courseStudents} />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Allocated Teaching Faculty
            </h3>
            <span className="text-xs text-muted-foreground">
              Instructors with permissions to create tasks and evaluate work
            </span>
          </div>

          {isTeachersLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : (
            <CourseTeacherTable teachers={courseTeachers} />
          )}
        </div>
      )}

      {/* Enroll Students Modal */}
      {enrollModalOpen && (
        <EnrollStudentsModal
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          isOpen={enrollModalOpen}
          onClose={() => setEnrollModalOpen(false)}
          alreadyEnrolledStudentIds={courseStudents.map((s) => s.studentId)}
        />
      )}

      {/* Allocate Teacher Modal */}
      {allocateModalOpen && (
        <AllocateTeacherModal
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          isOpen={allocateModalOpen}
          onClose={() => setAllocateModalOpen(false)}
          alreadyAllocatedTeacherIds={courseTeachers.map((t) => t.teacherId)}
        />
      )}
    </div>
  );
}
