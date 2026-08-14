import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  rows = 4,
  disabled,
  ...props
}) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm rounded-lg border bg-surface text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]",
          error
            ? "border-destructive focus:ring-destructive"
            : "border-input hover:border-border/80",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};
