import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "outline"
    | "secondary"
    | "accent";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary/10 text-primary border border-primary/20",
  success: "bg-success/15 text-success border border-success/30",
  warning: "bg-warning/20 text-warning-foreground border border-warning/40",
  destructive:
    "bg-destructive/15 text-destructive border border-destructive/30",
  outline: "bg-transparent text-foreground border border-border",
  secondary: "bg-secondary text-secondary-foreground border border-border/50",
  accent: "bg-accent text-accent-foreground border border-accent-foreground/20",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-[11px] font-semibold tracking-wide",
  md: "px-2.5 py-1 text-xs font-semibold",
  lg: "px-3 py-1.5 text-sm font-semibold",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
