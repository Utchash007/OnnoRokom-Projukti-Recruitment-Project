"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type CourseFormData } from "@/lib/validators";
import { useCourseStore } from "@/stores/course-store";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { CourseResponse } from "@/types/course";

export interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CourseResponse | null;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const isEdit = !!initialData;
  const { createCourse, updateCourse } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: initialData?.code || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData) {
        await updateCourse(initialData.id, data);
        toast.success("Course updated successfully");
      } else {
        await createCourse(data);
        toast.success("Course created successfully");
      }
      handleClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to save course");
      } else {
        toast.error("Failed to save course details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Course Subject" : "Create New Course"}
      description="Define the curriculum subject code, title, and descriptive overview."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Input
            id="code"
            label="Course Code"
            placeholder="e.g. CSE-101, PHY-202"
            error={errors.code?.message}
            {...register("code")}
          />

          <Input
            id="title"
            label="Course Title"
            placeholder="e.g. Introduction to Computer Science"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            id="description"
            label="Course Description (Optional)"
            placeholder="Overview of curriculum syllabus, objectives, and prerequisites..."
            rows={3}
            error={errors.description?.message}
            {...register("description")}
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
            {isEdit ? "Save Changes" : "Create Course"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
