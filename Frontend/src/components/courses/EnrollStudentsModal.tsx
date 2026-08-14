"use client";

import React, { useEffect, useState } from "react";
import { getBatches, getBatchStudents } from "@/lib/api/batches";
import { useCourseEnrollmentStore } from "@/stores/course-enrollment-store";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CheckSquare, Square, Users } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { BatchResponse, BatchStudentResponse } from "@/types/batch";

export interface EnrollStudentsModalProps {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  alreadyEnrolledStudentIds?: string[];
}

export const EnrollStudentsModal: React.FC<EnrollStudentsModalProps> = ({
  courseId,
  courseTitle,
  isOpen,
  onClose,
  alreadyEnrolledStudentIds = [],
}) => {
  const enrollStudents = useCourseEnrollmentStore(
    (state) => state.enrollStudents
  );
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batchStudents, setBatchStudents] = useState<BatchStudentResponse[]>([]);
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState<string[]>(
    []
  );

  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllBatches = async () => {
      setIsLoadingBatches(true);
      try {
        const data = await getBatches();
        setBatches(data);
      } catch {
        toast.error("Failed to load batches list");
      } finally {
        setIsLoadingBatches(false);
      }
    };

    fetchAllBatches();
  }, [isOpen]);

  useEffect(() => {
    if (!selectedBatchId) {
      setBatchStudents([]);
      setSelectedEnrollmentIds([]);
      return;
    }

    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const data = await getBatchStudents(selectedBatchId);
        // Only active batch members can be enrolled into courses
        const activeMembers = data.filter((s) => s.status === "Active");
        setBatchStudents(activeMembers);
        setSelectedEnrollmentIds([]);
      } catch {
        toast.error("Failed to load batch student roster");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedBatchId]);

  const toggleStudent = (enrollmentId: string) => {
    setSelectedEnrollmentIds((prev) =>
      prev.includes(enrollmentId)
        ? prev.filter((id) => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const toggleSelectAll = () => {
    const availableStudents = batchStudents.filter(
      (s) => !alreadyEnrolledStudentIds.includes(s.studentId)
    );

    if (selectedEnrollmentIds.length === availableStudents.length) {
      setSelectedEnrollmentIds([]);
    } else {
      setSelectedEnrollmentIds(availableStudents.map((s) => s.enrollmentId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEnrollmentIds.length === 0) {
      toast.error("Please select at least one student to enroll");
      return;
    }

    setIsSubmitting(true);
    try {
      await enrollStudents({
        courseId,
        batchEnrollmentIds: selectedEnrollmentIds,
      });
      toast.success(
        `Successfully enrolled ${selectedEnrollmentIds.length} students`
      );
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to enroll students");
      } else {
        toast.error("Failed to enroll students into course");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll Students into Course"
      description={`Select students from an active academic batch to enroll into ${courseTitle}.`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          {isLoadingBatches ? (
            <div className="flex h-20 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : (
            <Select
              id="batchSelect"
              label="1. Select Source Batch"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              placeholder="Choose a cohort batch..."
              options={batches.map((b) => ({
                value: b.id,
                label: `${b.name} (${b.code}) — ${b.termCode}`,
              }))}
            />
          )}

          {selectedBatchId && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Select Active Students ({selectedEnrollmentIds.length} selected)
                </label>
                {batchStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  >
                    {selectedEnrollmentIds.length ===
                    batchStudents.filter(
                      (s) => !alreadyEnrolledStudentIds.includes(s.studentId)
                    ).length ? (
                      <>
                        <Square className="h-3.5 w-3.5" /> Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-3.5 w-3.5" /> Select All
                      </>
                    )}
                  </button>
                )}
              </div>

              {isLoadingStudents ? (
                <div className="flex h-36 items-center justify-center">
                  <Spinner size="md" />
                </div>
              ) : batchStudents.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No active students found in this batch.
                </p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-border/80 bg-muted/20">
                  {batchStudents.map((s) => {
                    const isAlreadyEnrolled =
                      alreadyEnrolledStudentIds.includes(s.studentId);
                    const isSelected = selectedEnrollmentIds.includes(
                      s.enrollmentId
                    );

                    return (
                      <div
                        key={s.enrollmentId}
                        onClick={() =>
                          !isAlreadyEnrolled && toggleStudent(s.enrollmentId)
                        }
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                          isAlreadyEnrolled
                            ? "bg-muted/40 border-transparent opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-primary/10 border-primary/40 cursor-pointer"
                            : "bg-surface border-border/60 hover:border-border hover:bg-muted/30 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isAlreadyEnrolled}
                            onChange={() => {}}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {s.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.studentRoll
                                ? `Roll: ${s.studentRoll} · `
                                : ""}
                              {s.studentEmail}
                            </p>
                          </div>
                        </div>

                        {isAlreadyEnrolled && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Enrolled
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            disabled={selectedEnrollmentIds.length === 0}
            leftIcon={<Users className="h-4 w-4" />}
          >
            Enroll Selected ({selectedEnrollmentIds.length})
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
