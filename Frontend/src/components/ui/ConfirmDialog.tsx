"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <Modal.Body className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              variant === "destructive"
                ? "bg-destructive/15 text-destructive"
                : "bg-primary/15 text-primary"
            )}
          >
            {variant === "destructive" ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <Info className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "destructive" ? "destructive" : "primary"}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
