"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "@/lib/validators";
import { useSubmissionStore } from "@/stores/submission-store";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Award } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { SubmissionResponse } from "@/types/submission";

export interface ReviewFormProps {
  submission: SubmissionResponse;
  maximumMarks: number;
  onReviewed?: (updated: SubmissionResponse) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  submission,
  maximumMarks,
  onReviewed,
}) => {
  const reviewSubmission = useSubmissionStore(
    (state) => state.reviewSubmission
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      marks: submission.marks ?? 0,
      feedback: submission.feedback || "",
      status: (submission.status === "Returned" ? "Returned" : "Reviewed"),
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (data.marks > maximumMarks) {
      toast.error(`Marks cannot exceed maximum of ${maximumMarks} points`);
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await reviewSubmission(submission.id, {
        marks: data.marks,
        feedback: data.feedback || null,
        status: data.status,
      });
      toast.success("Submission evaluated and saved!");
      onReviewed?.(updated);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to review submission");
      } else {
        toast.error("Failed to save submission evaluation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/40 shadow-sm">
      <Card.Header className="bg-primary/5 pb-4">
        <Card.Title className="text-base flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Instructor Evaluation Panel
        </Card.Title>
        <Card.Description>
          Score this student&apos;s answer and provide qualitative feedback. Max score: {maximumMarks} pts.
        </Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="marks"
              label={`Score (0 to ${maximumMarks})`}
              type="number"
              min={0}
              max={maximumMarks}
              error={errors.marks?.message}
              {...register("marks")}
            />

            <Select
              id="status"
              label="Evaluation Status"
              options={[
                { value: "Reviewed", label: "Reviewed (Final Grade)" },
                {
                  value: "Returned",
                  label: "Returned (Needs Student Revision)",
                },
              ]}
              error={errors.status?.message}
              {...register("status")}
            />
          </div>

          <Textarea
            id="feedback"
            label="Qualitative Feedback & Comments"
            placeholder="Provide constructive guidance, strengths, areas of improvement..."
            rows={4}
            error={errors.feedback?.message}
            {...register("feedback")}
          />
        </Card.Content>

        <Card.Footer className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Submit Grade & Feedback
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};
