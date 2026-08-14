import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rounded",
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-muted/60",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        variant === "rounded" && "rounded-xl",
        variant === "text" && "h-4 w-full rounded-md",
        className
      )}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="w-full rounded-xl border border-border/80 bg-surface overflow-hidden p-4 space-y-4">
      <div className="flex items-center gap-4 pb-3 border-b border-border/60">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 py-2">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
};
