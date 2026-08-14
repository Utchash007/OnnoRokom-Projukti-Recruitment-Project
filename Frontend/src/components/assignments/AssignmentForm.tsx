"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  assignmentSchema,
  type AssignmentFormData,
} from "@/lib/validators";
import { useAssignmentStore } from "@/stores/assignment-store";
import { useAuthStore } from "@/stores/auth-store";
import { getTeacherCourses } from "@/lib/api/teacher-allocations";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { AssignmentResponse } from "@/types/assignment";
import type { TeacherCourseResponse } from "@/types/teacher-allocation";

export interface AssignmentFormProps {
  initialData?: AssignmentResponse | null;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const isEdit = !!initialData;
  const { user } = useAuthStore();
  const { createAssignment, updateAssignment } = useAssignmentStore();

  const [teacherCourses, setTeacherCourses] = useState<
    TeacherCourseResponse[]
  >([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const data = await getTeacherCourses(user.id);
        setTeacherCourses(data.filter((c) => c.status === "Active"));
      } catch {
        toast.error("Failed to load your allocated courses");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Format initial ISO date string for datetime-local input
  const formatDatetimeForInput = (isoDate?: string) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      // Format YYYY-MM-DDTHH:mm
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      courseId: initialData?.courseId || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      deadlineAt: formatDatetimeForInput(initialData?.deadlineAt),
      maximumMarks: initialData?.maximumMarks || 100,
      allowResubmission: initialData?.allowResubmission ?? true,
    },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const deadlineIso = new Date(data.deadlineAt).toISOString();

      if (isEdit && initialData) {
        await updateAssignment(initialData.id, {
          title: data.title,
          description: data.description || null,
          deadlineAt: deadlineIso,
          maximumMarks: data.maximumMarks,
          allowResubmission: data.allowResubmission,
        });
        toast.success("Assignment updated successfully");
        router.push(`/assignments/${initialData.id}`);
      } else {
        const created = await createAssignment({
          courseId: data.courseId,
          title: data.title,
          description: data.description || null,
          deadlineAt: deadlineIso,
          maximumMarks: data.maximumMarks,
          allowResubmission: data.allowResubmission,
        });
        toast.success("Assignment created as Draft!");
        router.push(`/assignments/${created.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to save assignment");
      } else {
        toast.error("Failed to save assignment details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <Card.Header>
        <Card.Title>
          {isEdit ? "Edit Assignment Details" : "Create New Course Assignment"}
        </Card.Title>
        <Card.Description>
          Specify the target course, prompt description, deadline date, maximum marks, and resubmission rules.
        </Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="space-y-5">
          {!isEdit && (
            <Select
              id="courseId"
              label="Target Course"
              placeholder={
                isLoadingCourses
                  ? "Loading allocated courses..."
                  : "Select a course..."
              }
              options={teacherCourses.map((c) => ({
                value: c.courseId,
                label: `${c.courseCode} — ${c.courseTitle}`,
              }))}
              error={errors.courseId?.message}
              {...register("courseId")}
            />
          )}

          <Input
            id="title"
            label="Assignment Title"
            placeholder="e.g. Lab Report 1: Binary Search Tree Implementation"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            id="description"
            label="Assignment Description & Instructions"
            placeholder="Describe the task requirements, formatting guidelines, submission expectations..."
            rows={6}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              id="deadlineAt"
              label="Submission Deadline"
              showTime
              error={errors.deadlineAt?.message}
              {...register("deadlineAt")}
            />

            <Input
              id="maximumMarks"
              label="Maximum Marks / Points"
              type="number"
              min={1}
              max={1000}
              placeholder="100"
              error={errors.maximumMarks?.message}
              {...register("maximumMarks")}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                {...register("allowResubmission")}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Allow Resubmissions
                </p>
                <p className="text-xs text-muted-foreground">
                  When enabled, students can update their submitted answers before the deadline.
                </p>
              </div>
            </label>
          </div>
        </Card.Content>

        <Card.Footer className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Assignment"}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};
