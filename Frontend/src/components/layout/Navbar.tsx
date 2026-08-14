"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Menu, Moon, Sun } from "lucide-react";

export interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const { user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/60 bg-surface/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Portal
          </span>
          <span className="text-sm font-bold text-foreground">
            {user?.role === "Admin"
              ? "Admin Console"
              : user?.role === "Teacher"
              ? "Teacher Workspace"
              : "Student Workspace"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-all cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-warning" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* User Info Capsule */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-border/60">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-foreground truncate max-w-[140px]">
                {user.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                {user.email}
              </span>
            </div>
            <StatusBadge status={user.role} size="sm" />
          </div>
        )}
      </div>
    </header>
  );
};
