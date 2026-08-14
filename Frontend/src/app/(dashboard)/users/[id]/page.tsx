"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UserForm } from "@/components/users/UserForm";
import { SetActiveStatusButton } from "@/components/users/SetActiveStatusButton";
import { ChangePasswordModal } from "@/components/users/ChangePasswordModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { KeyRound, Mail, Hash, Shield, Calendar } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
  const { selectedUser, isLoading, fetchUserById } = useUserStore();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserById(userId);
  }, [userId, fetchUserById]);

  if (isLoading && !selectedUser) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={selectedUser.fullName}
        description={`Profile details and security management for ${selectedUser.fullName}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Users", href: "/users" },
          { label: selectedUser.fullName },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card Overview (1 Column) */}
        <div className="space-y-6">
          <Card>
            <Card.Content className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-primary text-xl font-bold border-2 border-primary/20 shadow-inner">
                {getInitials(selectedUser.fullName)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedUser.fullName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedUser.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <StatusBadge status={selectedUser.role} size="md" />
                <StatusBadge
                  status={selectedUser.isActive ? "Active" : "Inactive"}
                  size="md"
                />
              </div>

              <div className="w-full pt-4 border-t border-border/40 space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[160px]">
                    {selectedUser.email}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" /> Roll / ID
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedUser.roll || "Not assigned"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Role
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Account Actions Card */}
          <Card>
            <Card.Header>
              <Card.Title className="text-sm">Account Security</Card.Title>
            </Card.Header>
            <Card.Content className="p-4 space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setPasswordModalOpen(true)}
                leftIcon={<KeyRound className="h-3.5 w-3.5" />}
              >
                Reset User Password
              </Button>

              <div className="pt-2 border-t border-border/40">
                <SetActiveStatusButton
                  userId={selectedUser.id}
                  userName={selectedUser.fullName}
                  isActive={selectedUser.isActive}
                  size="sm"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Edit Form / Details Section (2 Columns) */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header className="flex flex-row items-center justify-between pb-4">
              <div>
                <Card.Title className="text-base">
                  {isEditing ? "Edit Profile Information" : "Profile Information"}
                </Card.Title>
                <Card.Description>
                  Update account credentials and academic identification details.
                </Card.Description>
              </div>
              <Button
                variant={isEditing ? "ghost" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Card.Header>

            <Card.Content className="p-6">
              {isEditing ? (
                <UserForm
                  initialData={selectedUser}
                  onSuccess={() => setIsEditing(false)}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Full Name
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {selectedUser.fullName}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Email Address
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {selectedUser.email}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Student Roll / ID
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {selectedUser.roll || "None"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        System Role
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Reset Password Modal */}
      {passwordModalOpen && (
        <ChangePasswordModal
          isOpen={passwordModalOpen}
          userId={selectedUser.id}
          userName={selectedUser.fullName}
          onClose={() => setPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
