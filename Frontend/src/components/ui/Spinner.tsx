import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
