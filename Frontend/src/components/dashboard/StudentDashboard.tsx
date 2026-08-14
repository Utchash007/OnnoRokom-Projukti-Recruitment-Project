"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getStudentCourses } from "@/lib/api/course-enrollments";
import { getAssignments } from "@/lib/api/assignments";
import { getMySubmissions } from "@/lib/api/submissions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Award,
} from "lucide-react";
import type { StudentCourseResponse } from "@/types/course-enrollment";
import type { AssignmentResponse } from "@/types/assignment";
import type { SubmissionResponse } from "@/types/submission";

export const StudentDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<StudentCourseResponse[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesData, assignmentsData, submissionsData] =
          await Promise.all([
            getStudentCourses(user.id).catch(() => []),
            getAssignments().catch(() => []),
            getMySubmissions().catch(() => []),
          ]);

        setCourses(coursesData);
        setAssignments(assignmentsData);
        setSubmissions(submissionsData);
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

  // Create submission map for fast lookup
  const submissionByAssignment = new Map(
    submissions.map((s) => [s.assignmentId, s])
  );

  const reviewedSubmissions = submissions.filter(
    (s) => s.status === "Reviewed"
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Student Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-hover to-accent p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Welcome back, {user?.fullName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Learning Space
          </h2>
          <p className="mt-2 text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
            Stay on top of upcoming course assignments, submit your deliverables on time, and track feedback and grades from your instructors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/assignments">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Browse Assignments
              </Button>
            </Link>
            <Link href="/submissions">
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 text-white hover:bg-white/10"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                My Submissions
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
                Enrolled Courses
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {courses.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Active subjects
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
                Total Submissions
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {submissions.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted tasks
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Evaluated Work
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {reviewedSubmissions.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Graded by instructors
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Award className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Student Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Assignments (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Course Assignments
              </h3>
              <p className="text-xs text-muted-foreground">
                Tasks for your enrolled courses
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
                <p className="text-sm font-medium">No published assignments yet</p>
                <p className="text-xs mt-1">
                  When your teachers publish assignments for your courses, they will show up here.
                </p>
              </Card.Content>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((a) => {
                const sub = submissionByAssignment.get(a.id);
                return (
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
                          {sub ? (
                            <StatusBadge status={sub.status} size="sm" />
                          ) : (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning-foreground border border-warning/30">
                              Not Submitted
                            </span>
                          )}
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
                        {sub ? (
                          <Link href={`/submissions/${sub.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs font-medium"
                            >
                              View Submission
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/assignments/${a.id}`}>
                            <Button size="sm" className="text-xs font-medium">
                              Submit Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Enrolled Courses (1 column) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Enrolled Courses
            </h3>
            <p className="text-xs text-muted-foreground">
              Your registered subjects for this term
            </p>
          </div>

          <Card>
            <Card.Content className="p-4 space-y-3">
              {courses.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-4">
                  No courses enrolled yet. Contact your administrator.
                </p>
              ) : (
                courses.map((c) => (
                  <div
                    key={c.enrollmentId}
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
