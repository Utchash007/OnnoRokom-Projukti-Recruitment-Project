"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/api/users";
import { getCourses } from "@/lib/api/courses";
import { getBatches } from "@/lib/api/batches";
import { getAssignments } from "@/lib/api/assignments";
import { getTerms } from "@/lib/api/academic-terms";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  Users,
  BookOpen,
  Layers,
  FileText,
  Calendar,
  ArrowRight,
  UserPlus,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import type { UserResponse } from "@/types/user";
import type { CourseResponse } from "@/types/course";
import type { BatchResponse } from "@/types/batch";
import type { AssignmentResponse } from "@/types/assignment";
import type { AcademicTermResponse } from "@/types/academic-term";

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [terms, setTerms] = useState<AcademicTermResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersData, coursesData, batchesData, assignmentsData, termsData] =
          await Promise.all([
            getUsers().catch(() => []),
            getCourses().catch(() => []),
            getBatches().catch(() => []),
            getAssignments().catch(() => []),
            getTerms().catch(() => []),
          ]);

        setUsers(usersData);
        setCourses(coursesData);
        setBatches(batchesData);
        setAssignments(assignmentsData);
        setTerms(termsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const teacherCount = users.filter((u) => u.role === "Teacher").length;
  const studentCount = users.filter((u) => u.role === "Student").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-hover to-accent p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Admin Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Operations Center
          </h2>
          <p className="mt-2 text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
            Manage institutional users, terms, student batches, course enrollments, and academic workflows in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/users">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Manage Users
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 text-white hover:bg-white/10"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Catalog Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {users.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {teacherCount} Teachers · {studentCount} Students
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        {/* Courses */}
        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Courses
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {courses.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Active Catalog Subjects
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
              <BookOpen className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        {/* Batches */}
        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Academic Batches
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {batches.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Across {terms.length} Terms
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
              <Layers className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>

        {/* Assignments */}
        <Card className="hover:shadow-md transition-shadow">
          <Card.Content className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Assignments
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {assignments.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Total Course Tasks
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <FileText className="h-6 w-6" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management Hub */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </Card.Title>
              <Link
                href="/users"
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card.Description>
              Create and manage students, teachers, and administrators.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-2 pt-2">
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-sm"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-foreground truncate">
                    {u.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {u.email}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-surface font-medium border border-border text-muted-foreground shrink-0">
                  {u.role}
                </span>
              </div>
            ))}
          </Card.Content>
        </Card>

        {/* Academic Structure Hub */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning-foreground" />
                Terms & Batches
              </Card.Title>
              <Link
                href="/batches"
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card.Description>
              Configure academic terms and group students into cohorts.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-2 pt-2">
            {batches.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-sm"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-foreground truncate">
                    {b.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    Code: {b.code}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-surface font-medium border border-border text-muted-foreground shrink-0">
                  {b.termCode}
                </span>
              </div>
            ))}
          </Card.Content>
        </Card>

        {/* Course Catalog Hub */}
        <Card className="md:col-span-2 lg:col-span-1">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-success" />
                Course Catalog
              </Card.Title>
              <Link
                href="/courses"
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card.Description>
              Enroll batch students and allocate teachers to courses.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-2 pt-2">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-sm"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-foreground truncate">
                    {c.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    Code: {c.code}
                  </span>
                </div>
                <Link href={`/courses/${c.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Manage
                  </Button>
                </Link>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};
