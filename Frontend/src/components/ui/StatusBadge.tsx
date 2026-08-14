import React from "react";
import { Badge, type BadgeProps } from "./Badge";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: BadgeProps["size"];
}

const statusMap: Record<
  string,
  { variant: NonNullable<BadgeProps["variant"]>; label?: string }
> = {
  // Statuses for Active/Inactive
  Active: { variant: "success", label: "Active" },
  Inactive: { variant: "destructive", label: "Inactive" },

  // Assignment Statuses
  Draft: { variant: "warning", label: "Draft" },
  Published: { variant: "success", label: "Published" },

  // Submission Statuses
  Submitted: { variant: "default", label: "Submitted" },
  Late: { variant: "warning", label: "Late" },
  Reviewed: { variant: "success", label: "Reviewed" },
  Returned: { variant: "outline", label: "Returned" },

  // Roles
  Admin: { variant: "accent", label: "Admin" },
  Teacher: { variant: "default", label: "Teacher" },
  Student: { variant: "secondary", label: "Student" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "sm",
}) => {
  const config = statusMap[status] || {
    variant: "outline" as const,
    label: status,
  };

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {config.label || status}
    </Badge>
  );
};
