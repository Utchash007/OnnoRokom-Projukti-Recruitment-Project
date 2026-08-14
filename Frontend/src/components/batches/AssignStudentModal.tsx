"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "@/lib/api/users";
import { useBatchStore } from "@/stores/batch-store";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { UserResponse } from "@/types/user";

export interface AssignStudentModalProps {
  batchId: string;
  batchName: string;
  isOpen: boolean;
  onClose: () => void;
  alreadyEnrolledStudentIds?: string[];
}

export const AssignStudentModal: React.FC<AssignStudentModalProps> = ({
  batchId,
  batchName,
  isOpen,
  onClose,
  alreadyEnrolledStudentIds = [],
}) => {
  const assignStudent = useBatchStore((state) => state.assignStudent);
  const [students, setStudents] = useState<UserResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const studentList = await getUsers("Student");
        setStudents(studentList);
      } catch {
        toast.error("Failed to load student list");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isOpen]);

  const availableStudents = students.filter(
    (s) => !alreadyEnrolledStudentIds.includes(s.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Please select a student to assign");
      return;
    }

    setIsSubmitting(true);
    try {
      await assignStudent(batchId, { studentId: selectedStudentId });
      toast.success("Student assigned to batch successfully");
      setSelectedStudentId("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to assign student");
      } else {
        toast.error("Failed to assign student to batch");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Student to Batch"
      description={`Enroll a registered student into ${batchName}.`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {isLoadingStudents ? (
            <div className="flex h-24 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : availableStudents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              All registered students are already assigned to this batch.
            </p>
          ) : (
            <Select
              id="studentId"
              label="Select Student"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              placeholder="Choose a student..."
              options={availableStudents.map((s) => ({
                value: s.id,
                label: `${s.fullName} (${s.roll ? `Roll: ${s.roll}` : s.email})`,
              }))}
            />
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
            disabled={isLoadingStudents || availableStudents.length === 0}
          >
            Assign Student
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
