"use client";

import React, { useState } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import { Edit3, Trash2, Calendar } from "lucide-react";
import { useAcademicTermStore } from "@/stores/academic-term-store";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { AcademicTermResponse } from "@/types/academic-term";

export interface TermTableProps {
  terms: AcademicTermResponse[];
  onEdit: (term: AcademicTermResponse) => void;
}

export const TermTable: React.FC<TermTableProps> = ({ terms, onEdit }) => {
  const deleteTerm = useAcademicTermStore((state) => state.deleteTerm);
  const [deleteTarget, setDeleteTarget] =
    useState<AcademicTermResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTerm(deleteTarget.id);
      toast.success(`Term "${deleteTarget.code}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to delete term");
      } else {
        toast.error("Cannot delete term referenced by existing batches.");
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
            <Table.Head>Term Code</Table.Head>
            <Table.Head>Starts On</Table.Head>
            <Table.Head>Ends On</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {terms.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-8 text-muted-foreground">
                No academic terms registered yet.
              </Table.Cell>
            </Table.Row>
          ) : (
            terms.map((term) => (
              <Table.Row key={term.id}>
                <Table.Cell className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{term.code}</span>
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {formatDate(term.startsOn)}
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {formatDate(term.endsOn)}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(term)}
                      className="h-8 px-2 text-xs"
                      title="Edit Term"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(term)}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                      title="Delete Term"
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
          title="Delete Academic Term"
          message={`Are you sure you want to delete term "${deleteTarget.code}"? This action cannot be undone and will fail if batches are attached.`}
          confirmLabel="Delete Term"
          variant="destructive"
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
