"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  label,
  badge,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm font-semibold"
          : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center transition-colors",
            isActive
              ? "text-primary-foreground"
              : "text-sidebar-foreground/70 group-hover:text-white"
          )}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
            isActive
              ? "bg-white/20 text-primary-foreground"
              : "bg-sidebar-hover text-sidebar-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};
