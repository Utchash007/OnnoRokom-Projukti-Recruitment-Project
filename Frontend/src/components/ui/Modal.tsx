"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showCloseButton?: boolean;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  showCloseButton = true,
}) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-2xl bg-surface border border-border text-foreground shadow-2xl transition-all duration-200 animate-scale-in z-10 my-8 overflow-hidden",
          sizeStyles[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-border/50">
            <div>
              {title && (
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="max-h-[calc(85vh-140px)] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("p-6 pb-4 border-b border-border/50", className)} {...props}>
      {children}
    </div>
  );
};

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("p-6 space-y-4", className)} {...props}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 pt-4 border-t border-border/50 bg-surface/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
