"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { UserPlus, Filter } from "lucide-react";
import type { UserRole } from "@/types/enums";

export default function UsersPage() {
  const { users, isLoading, fetchUsers } = useUserStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (selectedRole === "ALL") {
      fetchUsers();
    } else {
      fetchUsers(selectedRole);
    }
  }, [selectedRole, fetchUsers]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View, register, and manage student, teacher, and administrator accounts."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Users" },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Create User
          </Button>
        }
      />

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 font-medium">
          <Filter className="h-3.5 w-3.5" />
          <span>Role:</span>
        </div>
        {(
          [
            { id: "ALL", label: "All Users" },
            { id: "Student", label: "Students" },
            { id: "Teacher", label: "Teachers" },
            { id: "Admin", label: "Administrators" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedRole(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === tab.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground border border-border hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <UserTable users={users} />
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New User"
        description="Fill in the details to register a new user in the system."
        size="md"
      >
        <Modal.Body>
          <UserForm
            onSuccess={() => setCreateModalOpen(false)}
            onCancel={() => setCreateModalOpen(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
