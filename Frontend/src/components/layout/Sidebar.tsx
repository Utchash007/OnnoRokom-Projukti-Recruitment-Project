"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { SidebarItem } from "./SidebarItem";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  BookOpen,
  FileText,
  CheckSquare,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-sidebar text-sidebar-foreground border-r border-border/20">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">
                OnnoRokom
              </h1>
              <p className="text-[11px] text-sidebar-foreground/70 font-medium">
                Academic Management
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden rounded-lg p-1.5 text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-hover"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-1">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            onClick={onClose}
          />

          {/* Admin Navigation */}
          {user?.role === "Admin" && (
            <>
              <div className="pt-5 pb-2 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  Administration
                </p>
              </div>
              <SidebarItem
                href="/users"
                icon={<Users className="h-4 w-4" />}
                label="Users"
                onClick={onClose}
              />
              <SidebarItem
                href="/academic-terms"
                icon={<Calendar className="h-4 w-4" />}
                label="Academic Terms"
                onClick={onClose}
              />
              <SidebarItem
                href="/batches"
                icon={<Layers className="h-4 w-4" />}
                label="Batches"
                onClick={onClose}
              />
              <SidebarItem
                href="/courses"
                icon={<BookOpen className="h-4 w-4" />}
                label="Courses"
                onClick={onClose}
              />
            </>
          )}

          {/* Teacher Navigation */}
          {user?.role === "Teacher" && (
            <>
              <div className="pt-5 pb-2 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  Teaching
                </p>
              </div>
              <SidebarItem
                href="/assignments"
                icon={<FileText className="h-4 w-4" />}
                label="Assignments"
                onClick={onClose}
              />
            </>
          )}

          {/* Student Navigation */}
          {user?.role === "Student" && (
            <>
              <div className="pt-5 pb-2 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  Academics
                </p>
              </div>
              <SidebarItem
                href="/assignments"
                icon={<FileText className="h-4 w-4" />}
                label="Assignments"
                onClick={onClose}
              />
              <SidebarItem
                href="/submissions"
                icon={<CheckSquare className="h-4 w-4" />}
                label="My Submissions"
                onClick={onClose}
              />
            </>
          )}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="pt-4 border-t border-border/20">
        <div className="flex items-center justify-between p-2 rounded-xl bg-sidebar-hover/60 mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground font-semibold text-xs border border-primary/30">
              {user?.fullName ? getInitials(user.fullName) : "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">
                {user?.fullName || "User"}
              </span>
              <span className="text-[11px] text-sidebar-foreground/70 truncate">
                {user?.email || ""}
              </span>
            </div>
          </div>
          {user && <StatusBadge status={user.role} size="sm" className="shrink-0" />}
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-destructive-foreground bg-destructive/20 hover:bg-destructive/30 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 shadow-lg">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl animate-scale-in z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
