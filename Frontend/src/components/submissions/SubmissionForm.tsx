"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSubmissionStore } from "@/stores/submission-store";
import { useSubmissionAttachmentStore } from "@/stores/submission-attachment-store";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AttachmentList } from "./AttachmentList";
import { AttachmentUpload } from "./AttachmentUpload";
import { Send, FileCheck } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { SubmissionResponse } from "@/types/submission";

export interface SubmissionFormProps {
  assignmentId: string;
  assignmentTitle: string;
  existingSubmission?: SubmissionResponse | null;
  onSuccess?: (submission: SubmissionResponse) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  assignmentId,
  assignmentTitle,
  existingSubmission,
  onSuccess,
}) => {
  const router = useRouter();
  const { submitOrUpdate } = useSubmissionStore();
  const { uploadAttachment } = useSubmissionAttachmentStore();

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionResponse | null>(existingSubmission || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<{ answerText: string }>({
    defaultValues: {
      answerText: existingSubmission?.answerText || "",
    },
  });

  const onSubmit = async (data: { answerText: string }) => {
    if (!data.answerText.trim() && !pendingFile && (!currentSubmission || currentSubmission.attachments.length === 0)) {
      toast.error("Please provide an answer text or upload a file");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit answer text
      const sub = await submitOrUpdate(assignmentId, {
        answerText: data.answerText.trim() || null,
      });

      // 2. Upload pending initial file if attached
      if (pendingFile) {
        try {
          const att = await uploadAttachment(sub.id, pendingFile);
          sub.attachments = [...(sub.attachments || []), att];
        } catch {
          toast.error("Answer saved, but file upload failed. You can re-upload.");
        }
      }

      toast.success(
        existingSubmission
          ? "Submission updated successfully!"
          : "Assignment submitted successfully!"
      );

      setCurrentSubmission(sub);
      onSuccess?.(sub);
      router.push(`/submissions/${sub.id}`);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to submit assignment");
      } else {
        toast.error("Failed to submit assignment answer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <Card.Header>
        <Card.Title className="text-base flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          {existingSubmission
            ? `Update Submission: ${assignmentTitle}`
            : `Submit Assignment: ${assignmentTitle}`}
        </Card.Title>
        <Card.Description>
          Provide your written response or code deliverables below.
        </Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="space-y-6">
          <Textarea
            id="answerText"
            label="Written Answer & Summary"
            placeholder="Type or paste your written response, explanation, or notes here..."
            rows={8}
            {...register("answerText")}
          />

          {/* If already submitted, manage attachments via live upload */}
          {currentSubmission ? (
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Attachments ({currentSubmission.attachments?.length || 0})
                </label>
                <div className="mt-2">
                  <AttachmentList
                    attachments={currentSubmission.attachments || []}
                    canDelete={true}
                    onDeleted={(attId) => {
                      setCurrentSubmission({
                        ...currentSubmission,
                        attachments: currentSubmission.attachments.filter(
                          (a) => a.id !== attId
                        ),
                      });
                    }}
                  />
                </div>
              </div>

              <AttachmentUpload
                submissionId={currentSubmission.id}
                onUploaded={(att) => {
                  setCurrentSubmission({
                    ...currentSubmission,
                    attachments: [...(currentSubmission.attachments || []), att],
                  });
                }}
              />
            </div>
          ) : (
            /* If brand new submission, attach file before initial save */
            <div className="pt-2 border-t border-border/40">
              <FileUpload
                label="Attach Deliverable (Optional)"
                onFileSelect={(file) => setPendingFile(file)}
                helperText="Attach code archive, PDF report, document, or screenshots (up to 10MB)"
              />
            </div>
          )}
        </Card.Content>

        <Card.Footer className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Send className="h-4 w-4" />}
          >
            {existingSubmission ? "Save Updates" : "Submit Deliverable"}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};
