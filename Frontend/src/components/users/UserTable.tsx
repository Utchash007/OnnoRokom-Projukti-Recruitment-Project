"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { SetActiveStatusButton } from "./SetActiveStatusButton";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { Modal } from "@/components/ui/Modal";
import { UserForm } from "./UserForm";
import { KeyRound, Edit3, ExternalLink } from "lucide-react";
import type { UserResponse } from "@/types/user";

export interface UserTableProps {
  users: UserResponse[];
}

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [passwordModalUser, setPasswordModalUser] =
    useState<UserResponse | null>(null);
  const [editModalUser, setEditModalUser] = useState<UserResponse | null>(null);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Roll / ID</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-8 text-muted-foreground">
                No users found.
              </Table.Cell>
            </Table.Row>
          ) : (
            users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell className="font-semibold text-foreground">
                  <Link
                    href={`/users/${user.id}`}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>{user.fullName}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </Link>
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {user.email}
                </Table.Cell>
                <Table.Cell className="text-muted-foreground">
                  {user.roll || <span className="text-muted-foreground/40">—</span>}
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={user.role} size="sm" />
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge
                    status={user.isActive ? "Active" : "Inactive"}
                    size="sm"
                  />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModalUser(user)}
                      className="h-8 px-2 text-xs"
                      title="Edit Profile"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPasswordModalUser(user)}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="Reset Password"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </Button>
                    <SetActiveStatusButton
                      userId={user.id}
                      userName={user.fullName}
                      isActive={user.isActive}
                      size="sm"
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Edit User Modal */}
      {editModalUser && (
        <Modal
          isOpen={!!editModalUser}
          onClose={() => setEditModalUser(null)}
          title="Edit User Profile"
          description={`Update information for ${editModalUser.fullName}`}
          size="md"
        >
          <Modal.Body>
            <UserForm
              initialData={editModalUser}
              onSuccess={() => setEditModalUser(null)}
              onCancel={() => setEditModalUser(null)}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Change Password Modal */}
      {passwordModalUser && (
        <ChangePasswordModal
          isOpen={!!passwordModalUser}
          userId={passwordModalUser.id}
          userName={passwordModalUser.fullName}
          onClose={() => setPasswordModalUser(null)}
        />
      )}
    </>
  );
};
