"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  showTime?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      className,
      showTime = false,
      disabled,
      value: propValue,
      defaultValue,
      onChange,
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    // Parse incoming value into date part and time part
    const initialVal = (propValue ?? defaultValue ?? "") as string;
    const [datePart, setDatePart] = useState(() => {
      if (initialVal.includes("T")) return initialVal.split("T")[0];
      return initialVal.slice(0, 10);
    });
    const [timePart, setTimePart] = useState(() => {
      if (initialVal.includes("T")) return initialVal.split("T")[1]?.slice(0, 5) || "23:59";
      return "23:59";
    });

    // Synchronize with external prop changes
    useEffect(() => {
      if (propValue !== undefined) {
        const val = propValue as string;
        if (val) {
          if (val.includes("T")) {
            const [d, t] = val.split("T");
            setDatePart(d || "");
            setTimePart(t ? t.slice(0, 5) : "23:59");
          } else {
            setDatePart(val.slice(0, 10));
          }
        } else {
          setDatePart("");
        }
      }
    }, [propValue]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      setDatePart(newDate);
      if (!newDate) {
        onChange?.({ target: { value: "", name } });
        return;
      }
      const combined = showTime ? `${newDate}T${timePart || "23:59"}` : newDate;
      onChange?.({ target: { value: combined, name } });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      setTimePart(newTime);
      if (datePart) {
        const combined = `${datePart}T${newTime || "23:59"}`;
        onChange?.({ target: { value: combined, name } });
      }
    };

    const combinedValue = showTime
      ? datePart
        ? `${datePart}T${timePart || "23:59"}`
        : ""
      : datePart;

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

        {showTime ? (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {/* Date Input (3 cols) */}
            <div className="sm:col-span-3 relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id={inputId}
                type="date"
                disabled={disabled}
                value={datePart}
                onChange={handleDateChange}
                className={cn(
                  "w-full h-10 pl-9 pr-3 text-sm rounded-lg border bg-surface text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]",
                  error
                    ? "border-destructive focus:ring-destructive"
                    : "border-input hover:border-border/80",
                  className
                )}
              />
            </div>

            {/* Time Input (2 cols) */}
            <div className="sm:col-span-2 relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
                <Clock className="h-4 w-4" />
              </div>
              <input
                type="time"
                disabled={disabled || !datePart}
                value={timePart}
                onChange={handleTimeChange}
                className={cn(
                  "w-full h-10 pl-9 pr-3 text-sm rounded-lg border bg-surface text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]",
                  error
                    ? "border-destructive focus:ring-destructive"
                    : "border-input hover:border-border/80",
                  className
                )}
              />
            </div>

            {/* Hidden Input for Form Ref & React Hook Form Submission */}
            <input
              type="hidden"
              ref={ref}
              name={name}
              value={combinedValue}
              {...props}
            />
          </div>
        ) : (
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              id={inputId}
              ref={ref}
              name={name}
              type="date"
              disabled={disabled}
              value={datePart}
              onChange={handleDateChange}
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
        )}

        {error ? (
          <p className="text-xs text-destructive animate-fade-in">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
