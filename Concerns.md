Let me find and read the markdown files in your project.

Listed directory Onnoroom
Viewed PLAN.md:1-122
Viewed Assistant_Software_Engineer_Recruitment_Project.md:1-120

I've read both files. Here's my analysis of the database model consistency:

## Consistency Analysis: PLAN.md vs. Recruitment Brief

Overall, the [PLAN.md](file:///d:/C_Sharp_projects/Onnoroom/PLAN.md) database design is **well-aligned** with the [recruitment brief](file:///d:/C_Sharp_projects/Onnoroom/Assistant_Software_Engineer_Recruitment_Project.md). The core entities and relationships correctly model the assignment/submission workflow. However, I found a few inconsistencies and gaps:

---

### 1. **Teacher Assigns Assignment to Class/Course + Subject — Mismatch**

The brief says (line 36–38):
> *"Assign an assignment to a specific **class/course and subject**"*

In the PLAN, an `ASSIGNMENT` links to a `TEACHER_ALLOCATION` (which itself links to a `GROUP_SUBJECT`). This means the teacher doesn't directly "assign to a class/course and subject" — they create an assignment under their own allocation. This **works functionally**, but it introduces a subtle inconsistency:

- If a teacher is allocated to the **same group-subject** that another teacher also teaches (PLAN line 121 allows this), assignments are scoped to the *allocation*, not to the *group-subject*. Students enrolled in that group would only see assignments from their specific teacher's allocation, **not all assignments for that subject in their class** — unless the query intentionally fans out across all allocations for a group-subject.

> [!WARNING]
> Decide whether students should see **all assignments for their group-subject** (regardless of which teacher created them) or only assignments from a **specific teacher's allocation**. The current FK chain (`ASSIGNMENT → TEACHER_ALLOCATION → GROUP_SUBJECT`) implicitly scopes to one teacher.

---

### 2. **`EnrollmentStatus` Enum — Missing from Public Types**

[PLAN.md line 55](file:///d:/C_Sharp_projects/Onnoroom/PLAN.md#L55) defines `STUDENT_ENROLLMENTS.status` as `"Active|Inactive"`, but [line 102–107](file:///d:/C_Sharp_projects/Onnoroom/PLAN.md#L102-L107) (Public Types section) **does not list** an `EnrollmentStatus` enum. All other enums (`UserRole`, `AcademicGroupType`, `AssignmentStatus`, `SubmissionStatus`) are listed.

---

### 3. **Teacher "Delete" Assignments — Not Modeled**

The brief (line 34) says teachers can **"Create, update, and delete assignments"**. The PLAN has no mention of soft-delete (`is_deleted`, `deleted_at`) on `ASSIGNMENTS`. If you hard-delete an assignment that has submissions, the FK cascade could destroy student work. This isn't strictly a *model* inconsistency, but it's a design gap worth noting.

---

### 4. **Admin "Manage Application-Level Settings" — No Table**

The brief (line 31–32) says Admins can *"Manage application-level settings where necessary."* There is no `SETTINGS` or `APP_CONFIG` table in the PLAN. This may be intentional (defer until needed), but it's a gap relative to the brief.

---

### 5. **No `USERS.name` or Profile Fields**

The brief references "students" and "teachers" by name in the UI context, but the `USERS` table (lines 21–27) only has `email`, `password_hash`, `role`, and `is_active`. There's no `name`, `first_name`, or any profile field. The brief doesn't explicitly require it, but a real UI would need display names.

---

### Summary Table

| Item | Brief Says | PLAN Models | Status |
|---|---|---|---|
| Roles (Admin/Teacher/Student) | ✅ | ✅ | **Consistent** |
| Classes/Courses | ✅ | ✅ (`AcademicGroupType`) | **Consistent** |
| Subjects | ✅ | ✅ | **Consistent** |
| Teacher→Subject/Class allocation | ✅ | ✅ (`TEACHER_ALLOCATIONS`) | **Consistent** |
| Assignment→Class+Subject | ✅ | Via `TEACHER_ALLOCATION` | ⚠️ **Indirect** |
| Assignment CRUD incl. delete | ✅ | No soft-delete modeled | ⚠️ **Gap** |
| Submissions + attachments | ✅ | ✅ | **Consistent** |
| Marks + feedback | ✅ | ✅ | **Consistent** |
| Draft/Published status | ✅ | ✅ | **Consistent** |
| Resubmission before deadline | ✅ | ✅ (`allow_resubmission`) | **Consistent** |
| Enrollment status enum in Public Types | — | Missing from list | ⚠️ **Omission** |
| App-level settings | ✅ | Not modeled | ⚠️ **Gap** |
| User display name | Implied | Not modeled | ⚠️ **Gap** |

The most architecturally significant item is **#1** — how assignments relate to group-subjects vs. teacher allocations will affect query logic throughout the app.