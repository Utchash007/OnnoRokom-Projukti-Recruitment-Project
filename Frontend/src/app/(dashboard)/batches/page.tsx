"use client";

import React, { useEffect, useState } from "react";
import { useBatchStore } from "@/stores/batch-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { BatchTable } from "@/components/batches/BatchTable";
import { BatchFormModal } from "@/components/batches/BatchFormModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { PlusCircle } from "lucide-react";
import type { BatchResponse } from "@/types/batch";

export default function BatchesPage() {
  const { batches, isLoading, fetchBatches } = useBatchStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBatch, setEditBatch] = useState<BatchResponse | null>(null);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleEdit = (batch: BatchResponse) => {
    setEditBatch(batch);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditBatch(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Academic Batches"
        description="Organize students into term-specific cohorts and academic batches."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Batches" },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create Batch
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <BatchTable batches={batches} onEdit={handleEdit} />
      )}

      {modalOpen && (
        <BatchFormModal
          isOpen={modalOpen}
          onClose={handleClose}
          initialData={editBatch}
        />
      )}
    </div>
  );
}
