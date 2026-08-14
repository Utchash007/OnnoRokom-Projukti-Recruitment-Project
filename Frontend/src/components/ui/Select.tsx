import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  options = [],
  placeholder,
  children,
  disabled,
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3.5 pr-10 text-sm rounded-lg border bg-surface text-foreground appearance-none transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input hover:border-border/80",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 pointer-events-none text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error ? (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};
