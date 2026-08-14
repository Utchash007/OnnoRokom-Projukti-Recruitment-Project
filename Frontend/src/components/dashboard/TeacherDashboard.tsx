"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getTeacherCourses } from "@/lib/api/teacher-allocations";
import { getAssignments } from "@/lib/api/assignments";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  PlusCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { TeacherCourseResponse } from "@/types/teacher-allocation";
import type { AssignmentResponse } from "@/types/assignment";

export const TeacherDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<TeacherCourseResponse[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesData, assignmentsData] = await Promise.all([
          getTeacherCourses(user.id).catch(() => []),
          getAssignments().catch(() => []),
        ]);

        setCourses(coursesData);
        setAssignments(assignmentsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const publishedCount = assignments.filter(
    (a) => a.status === "Published"
  ).length;
  const draftCount = assignments.filter((a) => a.status === "Draft").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Teacher Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-hover to-accent p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome back, {user?.fullName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teacher Workspace
          </h2>
          <p className="mt-2 text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
            Create course assignments, monitor student submissions, review submitted deliverables, and provide evaluated marks and feedback.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/assignments/create">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Create Assignment
              </Button>
            </Link>
            <Link href="/assignments">
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 text-white hover:bg-white/10"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                View All Assignments
              </Button>
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none"
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Allocated Courses
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {courses.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Active teaching courses
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Published Tasks
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {publishedCount}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Live for enrolled students
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
              <FileText className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Draft Assignments
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {draftCount}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Unpublished assignments
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
              <Clock className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assignments (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                My Course Assignments
              </h3>
              <p className="text-xs text-muted-foreground">
                Recent tasks created for your courses
              </p>
            </div>
            <Link
              href="/assignments"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <Card>
              <Card.Content className="p-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm font-medium">No assignments yet</p>
                <p className="text-xs mt-1">
                  Create your first assignment to begin receiving submissions.
                </p>
              </Card.Content>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((a) => (
                <Card
                  key={a.id}
                  className="hover:border-primary/40 transition-colors"
                >
                  <Card.Content className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {a.courseCode}
                        </span>
                        <StatusBadge status={a.status} size="sm" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">
                        {a.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Deadline: {formatDate(a.deadlineAt)} · Max:{" "}
                        {a.maximumMarks} pts
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/assignments/${a.id}/submissions`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Submissions
                        </Button>
                      </Link>
                      <Link href={`/assignments/${a.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Allocated Courses (1 column) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Allocated Courses
            </h3>
            <p className="text-xs text-muted-foreground">
              Courses assigned to your teaching load
            </p>
          </div>

          <Card>
            <Card.Content className="p-4 space-y-3">
              {courses.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-4">
                  No courses allocated yet. Contact administrator.
                </p>
              ) : (
                courses.map((c) => (
                  <div
                    key={c.allocationId}
                    className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">
                        {c.courseCode}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {c.courseTitle}
                    </p>
                  </div>
                ))
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};
