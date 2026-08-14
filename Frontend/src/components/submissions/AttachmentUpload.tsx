"use client";

import React, { useState } from "react";
import { useSubmissionAttachmentStore } from "@/stores/submission-attachment-store";
import { FileUpload } from "@/components/ui/FileUpload";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import type { AttachmentResponse } from "@/types/submission-attachment";

export interface AttachmentUploadProps {
  submissionId: string;
  onUploaded?: (attachment: AttachmentResponse) => void;
  disabled?: boolean;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  submissionId,
  onUploaded,
  disabled = false,
}) => {
  const { uploadAttachment, isUploading } = useSubmissionAttachmentStore();
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);
    try {
      const result = await uploadAttachment(submissionId, file);
      toast.success(`Uploaded "${file.name}"`);
      onUploaded?.(result);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Failed to upload file");
      toast.error("Failed to upload attachment file");
    }
  };

  return (
    <div className="space-y-2">
      <FileUpload
        onFileSelect={handleFileSelect}
        disabled={disabled || isUploading}
        error={error || undefined}
        label="Upload Attachments"
        helperText="Supported files: PDF, DOCX, ZIP, images, code files (up to 10MB)"
      />

      {isUploading && (
        <div className="flex items-center justify-center gap-2 p-2 text-xs text-primary font-medium">
          <Spinner size="sm" />
          <span>Uploading attachment to server...</span>
        </div>
      )}
    </div>
  );
};
