"use client";

import React, { useState, useRef } from "react";
import { cn, formatFileSize } from "@/lib/utils";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeBytes?: number; // default 10MB
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  label,
  error: initialError,
  helperText,
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = initialError || error;

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    if (maxSizeBytes && file.size > maxSizeBytes) {
      setError(`File size exceeds limit of ${formatFileSize(maxSizeBytes)}`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-150 cursor-pointer bg-surface",
          dragOver
            ? "border-primary bg-primary/5 scale-[0.99]"
            : displayError
            ? "border-destructive bg-destructive/5"
            : "border-border/80 hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Max size: {formatFileSize(maxSizeBytes)}
            </p>
          </div>
        )}
      </div>

      {displayError ? (
        <p className="text-xs text-destructive animate-fade-in">{displayError}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};
