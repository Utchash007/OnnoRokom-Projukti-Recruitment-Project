import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border/80 bg-surface/50 my-4",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
