"use client";

import React, { useState } from "react";
import { useSubmissionAttachmentStore } from "@/stores/submission-attachment-store";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FileText, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { AttachmentResponse } from "@/types/submission-attachment";

export interface AttachmentListProps {
  attachments: AttachmentResponse[];
  canDelete?: boolean;
  onDeleted?: (attachmentId: string) => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  canDelete = false,
  onDeleted,
}) => {
  const { downloadAttachment, deleteAttachment } =
    useSubmissionAttachmentStore();
  const [deleteTarget, setDeleteTarget] =
    useState<AttachmentResponse | null>(null);
  const [isDownloadingId, setIsDownloadingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (att: AttachmentResponse) => {
    setIsDownloadingId(att.id);
    try {
      await downloadAttachment(att.id, att.originalFileName);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download attachment file");
    } finally {
      setIsDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAttachment(deleteTarget.id);
      toast.success(`Removed "${deleteTarget.originalFileName}"`);
      onDeleted?.(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete attachment");
    } finally {
      setIsDeleting(false);
    }
  };

  if (attachments.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic py-2">
        No attachment files uploaded.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-surface hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-sm font-semibold text-foreground truncate">
                  {att.originalFileName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(att.byteSize)} · {att.contentType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleDownload(att)}
                isLoading={isDownloadingId === att.id}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download
              </Button>

              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(att)}
                  className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                  title="Remove Attachment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Remove Attachment"
          message={`Are you sure you want to remove "${deleteTarget.originalFileName}"?`}
          confirmLabel="Remove File"
          variant="destructive"
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
