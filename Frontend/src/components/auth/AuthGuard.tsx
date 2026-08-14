"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/enums";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";

export interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, isLoading, fetchMe } =
    useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchMe();
    }
  }, [isInitialized, fetchMe]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (
      isInitialized &&
      isAuthenticated &&
      user &&
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      toast.error("You do not have permission to access this page.");
      router.replace("/dashboard");
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  if (!isInitialized || isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
};
