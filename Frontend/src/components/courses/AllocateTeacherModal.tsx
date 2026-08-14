"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "@/lib/api/users";
import { useTeacherAllocationStore } from "@/stores/teacher-allocation-store";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";
import type { UserResponse } from "@/types/user";

export interface AllocateTeacherModalProps {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  alreadyAllocatedTeacherIds?: string[];
}

export const AllocateTeacherModal: React.FC<AllocateTeacherModalProps> = ({
  courseId,
  courseTitle,
  isOpen,
  onClose,
  alreadyAllocatedTeacherIds = [],
}) => {
  const allocateTeacher = useTeacherAllocationStore(
    (state) => state.allocateTeacher
  );
  const [teachers, setTeachers] = useState<UserResponse[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        const teacherList = await getUsers("Teacher");
        setTeachers(teacherList);
      } catch {
        toast.error("Failed to load teachers list");
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [isOpen]);

  const availableTeachers = teachers.filter(
    (t) => !alreadyAllocatedTeacherIds.includes(t.id) && t.isActive
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      toast.error("Please select a teacher to allocate");
      return;
    }

    setIsSubmitting(true);
    try {
      await allocateTeacher({
        teacherId: selectedTeacherId,
        courseId,
      });
      toast.success("Teacher allocated to course successfully");
      setSelectedTeacherId("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Failed to allocate teacher");
      } else {
        toast.error("Failed to allocate teacher to course");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Allocate Instructor to Course"
      description={`Grant assignment creation and evaluation authority for ${courseTitle}.`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {isLoadingTeachers ? (
            <div className="flex h-24 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : availableTeachers.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              All active teachers are already allocated to this course.
            </p>
          ) : (
            <Select
              id="teacherId"
              label="Select Instructor"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              placeholder="Choose a faculty teacher..."
              options={availableTeachers.map((t) => ({
                value: t.id,
                label: `${t.fullName} (${t.email})`,
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
            disabled={isLoadingTeachers || availableTeachers.length === 0}
            leftIcon={<UserCheck className="h-4 w-4" />}
          >
            Allocate Teacher
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
