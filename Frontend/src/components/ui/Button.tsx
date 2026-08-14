import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.98]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98]",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm active:scale-[0.98]",
  ghost: "bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-muted active:scale-[0.98]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size={size === "lg" ? "md" : "sm"} className="text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
