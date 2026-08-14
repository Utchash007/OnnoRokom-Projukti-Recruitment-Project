"use client";

import React, { useState } from "react";
import { AssignmentCard } from "./AssignmentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { FileText, Search, Filter } from "lucide-react";
import type { AssignmentResponse } from "@/types/assignment";

export interface AssignmentListProps {
  assignments: AssignmentResponse[];
  courses?: { id: string; code: string; title: string }[];
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  courses = [],
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredAssignments = assignments.filter((a) => {
    const matchesCourse =
      selectedCourseId === "ALL" || a.courseId === selectedCourseId;
    const matchesStatus =
      statusFilter === "ALL" || a.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCourse && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border/80 shadow-xs">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search assignments or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          {courses.length > 0 && (
            <div className="w-full sm:w-60">
              <Select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                options={[
                  { value: "ALL", label: "All Courses" },
                  ...courses.map((c) => ({
                    value: c.id,
                    label: `${c.code} — ${c.title}`,
                  })),
                ]}
              />
            </div>
          )}

          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("Published")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "Published"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("Draft")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "Draft"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7 text-muted-foreground" />}
          title="No assignments found"
          description={
            searchQuery || selectedCourseId !== "ALL" || statusFilter !== "ALL"
              ? "Try adjusting your filters or search terms."
              : "No course assignments have been registered yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      )}
    </div>
  );
};
