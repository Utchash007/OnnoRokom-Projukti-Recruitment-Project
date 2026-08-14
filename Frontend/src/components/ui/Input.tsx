import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3.5 text-sm rounded-lg border bg-surface text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input hover:border-border/80",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};
