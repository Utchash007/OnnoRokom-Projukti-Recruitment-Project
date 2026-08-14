"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  switch (user.role) {
    case "Admin":
      return <AdminDashboard />;
    case "Teacher":
      return <TeacherDashboard />;
    case "Student":
      return <StudentDashboard />;
    default:
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Invalid role configuration. Please log out and sign in again.
        </div>
      );
  }
}
