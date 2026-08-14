"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { termSchema, type TermFormData } from "@/lib/validators";
import { useAcademicTermStore } from "@/stores/academic-term-store";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { AcademicTermResponse } from "@/types/academic-term";

export interface TermFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AcademicTermResponse | null;
}

export const TermFormModal: React.FC<TermFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const isEdit = !!initialData;
  const { createTerm, updateTerm } = useAcademicTermStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TermFormData>({
    resolver: zodResolver(termSchema),
    defaultValues: {
      code: initialData?.code || "",
      startsOn: initialData?.startsOn || "",
      endsOn: initialData?.endsOn || "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TermFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData) {
        await updateTerm(initialData.id, data);
        toast.success("Academic term updated successfully");
      } else {
        await createTerm(data);
        toast.success("Academic term created successfully");
      }
      handleClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to save academic term");
      } else {
        toast.error("Failed to save academic term");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Academic Term" : "Create Academic Term"}
      description="Define the code and active calendar duration for this academic term."
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Input
            id="code"
            label="Term Code"
            placeholder="e.g. Fall 2026, Spring 2027"
            error={errors.code?.message}
            {...register("code")}
          />

          <DatePicker
            id="startsOn"
            label="Start Date"
            error={errors.startsOn?.message}
            {...register("startsOn")}
          />

          <DatePicker
            id="endsOn"
            label="End Date"
            error={errors.endsOn?.message}
            {...register("endsOn")}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Term"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
