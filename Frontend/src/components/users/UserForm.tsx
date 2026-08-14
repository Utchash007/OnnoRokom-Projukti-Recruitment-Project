"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/lib/validators";
import { useUserStore } from "@/stores/user-store";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Lock, Eye, EyeOff, User, Mail, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { UserResponse } from "@/types/user";

export interface UserFormProps {
  initialData?: UserResponse | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!initialData;
  const { createUser, updateUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      roll: initialData?.roll || "",
      role: (initialData?.role as any) || "Student",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData) {
        await updateUser(initialData.id, {
          fullName: data.fullName,
          email: data.email,
          roll: data.roll || null,
        });
        toast.success("User profile updated successfully");
      } else {
        await createUser({
          fullName: data.fullName,
          email: data.email,
          roll: data.roll || null,
          password: data.password,
          role: data.role,
        });
        toast.success("User created successfully");
      }
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to save user");
      } else {
        toast.error("Failed to save user details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="fullName"
        label="Full Name"
        placeholder="e.g. Jane Doe"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="jane@institution.edu"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Roll field - especially relevant for Students */}
      <Input
        id="roll"
        label="Student Roll / ID (Optional)"
        placeholder="e.g. 2024-CSE-001"
        leftIcon={<Hash className="h-4 w-4" />}
        error={errors.roll?.message}
        helperText="Academic roll number or identifier"
        {...register("roll")}
      />

      {!isEdit && (
        <>
          <Select
            id="role"
            label="User Role"
            options={[
              { value: "Student", label: "Student" },
              { value: "Teacher", label: "Teacher" },
              { value: "Admin", label: "Administrator" },
            ]}
            error={(errors as any).role?.message}
            {...register("role")}
          />

          <Input
            id="password"
            label="Initial Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={(errors as any).password?.message}
            {...register("password")}
          />
        </>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" isLoading={isSubmitting}>
          {isEdit ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
};
