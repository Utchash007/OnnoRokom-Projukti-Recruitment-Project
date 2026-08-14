import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showTime?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  showTime = false,
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
        <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
          <Calendar className="h-4 w-4" />
        </div>
        <input
          id={inputId}
          type={showTime ? "datetime-local" : "date"}
          disabled={disabled}
          className={cn(
            "w-full h-10 pl-9 pr-3.5 text-sm rounded-lg border bg-surface text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input hover:border-border/80",
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};
