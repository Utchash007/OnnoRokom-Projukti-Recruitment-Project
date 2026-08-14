import type { UserRole } from "@/types/enums";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  ACADEMIC_TERMS: "/academic-terms",
  BATCHES: "/batches",
  COURSES: "/courses",
  ASSIGNMENTS: "/assignments",
  SUBMISSIONS: "/submissions",
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  Admin: "Administrator",
  Teacher: "Teacher",
  Student: "Student",
};

export const STATUS_COLORS: Record<string, string> = {
  Active: "success",
  Inactive: "destructive",
  Draft: "warning",
  Published: "success",
  Submitted: "default",
  Late: "warning",
  Reviewed: "success",
  Returned: "outline",
} as const;

export const TOKEN_KEY = "access_token";
export const TOKEN_EXPIRY_KEY = "token_expires_at";
