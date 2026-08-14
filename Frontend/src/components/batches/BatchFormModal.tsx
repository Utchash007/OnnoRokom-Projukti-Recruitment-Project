"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { batchSchema, type BatchFormData } from "@/lib/validators";
import { useBatchStore } from "@/stores/batch-store";
import { useAcademicTermStore } from "@/stores/academic-term-store";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { BatchResponse } from "@/types/batch";

export interface BatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BatchResponse | null;
}

export const BatchFormModal: React.FC<BatchFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const isEdit = !!initialData;
  const { createBatch, updateBatch } = useBatchStore();
  const { terms, fetchTerms } = useAcademicTermStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (terms.length === 0) {
      fetchTerms();
    }
  }, [terms.length, fetchTerms]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      termId: initialData?.termId || "",
      code: initialData?.code || "",
      name: initialData?.name || "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: BatchFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData) {
        await updateBatch(initialData.id, {
          code: data.code,
          name: data.name,
        });
        toast.success("Batch updated successfully");
      } else {
        await createBatch({
          termId: data.termId,
          code: data.code,
          name: data.name,
        });
        toast.success("Batch created successfully");
      }
      handleClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to save batch");
      } else {
        toast.error("Failed to save batch");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Academic Batch" : "Create New Batch"}
      description="Associate students in a term-specific academic cohort."
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {!isEdit && (
            <Select
              id="termId"
              label="Academic Term"
              placeholder="Select an academic term"
              options={terms.map((t) => ({
                value: t.id,
                label: `${t.code} (${t.startsOn} to ${t.endsOn})`,
              }))}
              error={errors.termId?.message}
              {...register("termId")}
            />
          )}

          <Input
            id="code"
            label="Batch Code"
            placeholder="e.g. BATCH-2026-A"
            error={errors.code?.message}
            {...register("code")}
          />

          <Input
            id="name"
            label="Batch Name"
            placeholder="e.g. Computer Science - Morning Batch"
            error={errors.name?.message}
            {...register("name")}
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
            {isEdit ? "Save Changes" : "Create Batch"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
