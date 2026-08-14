"use client";

import React, { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UserCheck, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";

export interface SetActiveStatusButtonProps {
  userId: string;
  userName: string;
  isActive: boolean;
  size?: "sm" | "md";
}

export const SetActiveStatusButton: React.FC<SetActiveStatusButtonProps> = ({
  userId,
  userName,
  isActive,
  size = "sm",
}) => {
  const setActiveStatus = useUserStore((state) => state.setActiveStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await setActiveStatus(userId, { isActive: !isActive });
      toast.success(
        `${userName} is now ${!isActive ? "Active" : "Inactive"}`
      );
      setDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to update status");
      } else {
        toast.error("Failed to update user active status");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={isActive ? "ghost" : "outline"}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={
          isActive
            ? "text-destructive hover:bg-destructive/10"
            : "text-success hover:bg-success/10 border-success/30"
        }
        leftIcon={
          isActive ? (
            <UserX className="h-3.5 w-3.5" />
          ) : (
            <UserCheck className="h-3.5 w-3.5" />
          )
        }
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>

      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleToggle}
        title={isActive ? "Deactivate User Account" : "Activate User Account"}
        message={
          isActive
            ? `Are you sure you want to deactivate ${userName}'s account? They will not be able to log in until reactivated.`
            : `Are you sure you want to activate ${userName}'s account? They will regain access to the portal.`
        }
        confirmLabel={isActive ? "Deactivate" : "Activate"}
        variant={isActive ? "destructive" : "primary"}
        isLoading={isLoading}
      />
    </>
  );
};
