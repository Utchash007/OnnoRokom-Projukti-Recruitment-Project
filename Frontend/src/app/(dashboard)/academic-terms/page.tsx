"use client";

import React, { useEffect, useState } from "react";
import { useAcademicTermStore } from "@/stores/academic-term-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { TermTable } from "@/components/academic-terms/TermTable";
import { TermFormModal } from "@/components/academic-terms/TermFormModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { PlusCircle } from "lucide-react";
import type { AcademicTermResponse } from "@/types/academic-term";

export default function AcademicTermsPage() {
  const { terms, isLoading, fetchTerms } = useAcademicTermStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTerm, setEditTerm] = useState<AcademicTermResponse | null>(null);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const handleEdit = (term: AcademicTermResponse) => {
    setEditTerm(term);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTerm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Academic Terms"
        description="Configure institutional semesters, trimesters, and academic calendars."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Academic Terms" },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create Term
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <TermTable terms={terms} onEdit={handleEdit} />
      )}

      {modalOpen && (
        <TermFormModal
          isOpen={modalOpen}
          onClose={handleClose}
          initialData={editTerm}
        />
      )}
    </div>
  );
}
