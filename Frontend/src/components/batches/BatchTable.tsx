"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit3, Trash2, Users, Layers, ExternalLink } from "lucide-react";
import { useBatchStore } from "@/stores/batch-store";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { BatchResponse } from "@/types/batch";

export interface BatchTableProps {
  batches: BatchResponse[];
  onEdit: (batch: BatchResponse) => void;
}

export const BatchTable: React.FC<BatchTableProps> = ({ batches, onEdit }) => {
  const deleteBatch = useBatchStore((state) => state.deleteBatch);
  const [deleteTarget, setDeleteTarget] = useState<BatchResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBatch(deleteTarget.id);
      toast.success(`Batch "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to delete batch");
      } else {
        toast.error("Cannot delete batch with active student enrollments.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Batch Code</Table.Head>
            <Table.Head>Batch Name</Table.Head>
            <Table.Head>Academic Term</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {batches.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-8 text-muted-foreground">
                No batches registered yet.
              </Table.Cell>
            </Table.Row>
          ) : (
            batches.map((batch) => (
              <Table.Row key={batch.id}>
                <Table.Cell className="font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-warning-foreground" />
                  <Link
                    href={`/batches/${batch.id}`}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>{batch.code}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </Link>
                </Table.Cell>
                <Table.Cell className="text-foreground font-medium">
                  {batch.name}
                </Table.Cell>
                <Table.Cell>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-semibold">
                    {batch.termCode}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/batches/${batch.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        leftIcon={<Users className="h-3.5 w-3.5" />}
                      >
                        Students
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(batch)}
                      className="h-8 px-2 text-xs"
                      title="Edit Batch"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(batch)}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                      title="Delete Batch"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Batch"
          message={`Are you sure you want to delete batch "${deleteTarget.name}" (${deleteTarget.code})?`}
          confirmLabel="Delete Batch"
          variant="destructive"
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
