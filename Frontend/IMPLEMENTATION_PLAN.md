# Frontend Detailed Implementation Plan

> **Project**: Assignment & Submission Management System — Next.js Frontend  
> **Stack**: Next.js 15 (App Router) · React 19 · TypeScript · Zustand · Tailwind CSS v4  
> **Backend**: ASP.NET Core 10 Web API (cookie-based auth) at `http://localhost:5000`  
> **Reference**: [PLAN.md](file:///d:/C_Sharp_projects/Onnoroom/PLAN.md) · [Requirements](file:///d:/C_Sharp_projects/Onnoroom/Assistant_Software_Engineer_Recruitment_Project.md) · [Backend Plan](file:///d:/C_Sharp_projects/Onnoroom/Backend/IMPLEMENTATION_PLAN.md)

---

## 1. NPM Packages to Install

| Package | Purpose |
|---|---|
| `next` (v15) | App Router, SSR, file-system routing |
| `react`, `react-dom` (v19) | UI rendering |
| `typescript`, `@types/react`, `@types/node` | Type safety |
| `zustand` | Lightweight state management |
| `tailwindcss` (v4) | CSS-first utility styling |
| `@tailwindcss/postcss` | PostCSS integration for Tailwind v4 |
| `clsx` | Conditional class composition |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icon library |
| `date-fns` | Date formatting and manipulation |
| `react-hook-form` | Form handling with validation |
| `@hookform/resolvers` + `zod` | Schema-based form validation |

**Dev Dependencies**:
| Package | Purpose |
|---|---|
| `eslint`, `eslint-config-next` | Linting |
| `prettier`, `prettier-plugin-tailwindcss` | Code formatting |

---

## 2. Project Initialization

```bash
cd Frontend
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
npm install zustand clsx react-hot-toast lucide-react date-fns react-hook-form @hookform/resolvers zod
```

---

## 3. Final Folder Structure

All paths relative to `Frontend/`.

```
Frontend/
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts                     # Minimal — Tailwind v4 uses CSS-first
├── tsconfig.json
├── package.json
│
├── src/
│   ├── app/                               # Next.js App Router pages
│   │   ├── layout.tsx                     # Root layout (Providers, Toaster, Sidebar)
│   │   ├── page.tsx                       # Landing → redirect to /login or /dashboard
│   │   ├── globals.css                    # Tailwind v4 @theme + design tokens
│   │   │
│   │   ├── (auth)/                        # Auth route group (no sidebar)
│   │   │   ├── layout.tsx                 # Centered auth layout
│   │   │   └── login/
│   │   │       └── page.tsx               # Login page
│   │   │
│   │   └── (dashboard)/                   # Protected route group (sidebar + navbar)
│   │       ├── layout.tsx                 # Dashboard layout with sidebar, navbar, auth guard
│   │       ├── dashboard/
│   │       │   └── page.tsx               # Role-based dashboard home
│   │       │
│   │       ├── users/                     # Admin only
│   │       │   ├── page.tsx               # User list
│   │       │   └── [id]/
│   │       │       └── page.tsx           # User detail / edit
│   │       │
│   │       ├── academic-terms/            # Admin only
│   │       │   └── page.tsx               # Term list + create/edit modal
│   │       │
│   │       ├── batches/                   # Admin only
│   │       │   ├── page.tsx               # Batch list
│   │       │   └── [id]/
│   │       │       └── page.tsx           # Batch detail + student management
│   │       │
│   │       ├── courses/                   # Admin only
│   │       │   ├── page.tsx               # Course list
│   │       │   └── [id]/
│   │       │       └── page.tsx           # Course detail: enrollments + teachers
│   │       │
│   │       ├── assignments/               # Teacher + Student (role-filtered)
│   │       │   ├── page.tsx               # Assignment list
│   │       │   ├── create/
│   │       │   │   └── page.tsx           # Create assignment (Teacher)
│   │       │   └── [id]/
│   │       │       ├── page.tsx           # Assignment detail
│   │       │       ├── edit/
│   │       │       │   └── page.tsx       # Edit assignment (Teacher)
│   │       │       └── submissions/
│   │       │           └── page.tsx       # Submissions for this assignment (Teacher/Admin)
│   │       │
│   │       └── submissions/               # Student views
│   │           ├── page.tsx               # My submissions (Student)
│   │           └── [id]/
│   │               └── page.tsx           # Submission detail (marks, feedback, attachments)
│   │
│   ├── components/
│   │   ├── ui/                            # Reusable design-system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── DatePicker.tsx
│   │   │
│   │   ├── layout/                        # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── AuthGuard.tsx              # Redirect if not authenticated / wrong role
│   │   │
│   │   ├── users/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserForm.tsx               # Create / Edit
│   │   │   ├── SetActiveStatusButton.tsx
│   │   │   └── ChangePasswordModal.tsx
│   │   │
│   │   ├── academic-terms/
│   │   │   ├── TermTable.tsx
│   │   │   └── TermFormModal.tsx          # Create / Edit in a modal
│   │   │
│   │   ├── batches/
│   │   │   ├── BatchTable.tsx
│   │   │   ├── BatchFormModal.tsx
│   │   │   ├── BatchStudentTable.tsx
│   │   │   └── AssignStudentModal.tsx
│   │   │
│   │   ├── courses/
│   │   │   ├── CourseTable.tsx
│   │   │   ├── CourseFormModal.tsx
│   │   │   ├── CourseStudentTable.tsx
│   │   │   ├── CourseTeacherTable.tsx
│   │   │   ├── EnrollStudentsModal.tsx
│   │   │   └── AllocateTeacherModal.tsx
│   │   │
│   │   ├── assignments/
│   │   │   ├── AssignmentCard.tsx
│   │   │   ├── AssignmentList.tsx
│   │   │   ├── AssignmentForm.tsx         # Create / Edit
│   │   │   └── AssignmentDetail.tsx
│   │   │
│   │   ├── submissions/
│   │   │   ├── SubmissionTable.tsx         # Teacher view: all submissions for an assignment
│   │   │   ├── SubmissionForm.tsx          # Student: submit / update answer
│   │   │   ├── SubmissionDetail.tsx        # View with marks, feedback
│   │   │   ├── ReviewForm.tsx             # Teacher: grade + feedback
│   │   │   ├── AttachmentList.tsx
│   │   │   └── AttachmentUpload.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── AdminDashboard.tsx
│   │       ├── TeacherDashboard.tsx
│   │       └── StudentDashboard.tsx
│   │
│   ├── lib/                               # Shared utilities
│   │   ├── api/                           # API client layer
│   │   │   ├── client.ts                  # Base fetch wrapper (credentials: 'include')
│   │   │   ├── auth.ts                    # Auth API calls
│   │   │   ├── users.ts                   # User API calls
│   │   │   ├── academic-terms.ts          # Academic term API calls
│   │   │   ├── batches.ts                 # Batch API calls
│   │   │   ├── courses.ts                 # Course API calls
│   │   │   ├── course-enrollments.ts      # Course enrollment API calls
│   │   │   ├── teacher-allocations.ts     # Teacher allocation API calls
│   │   │   ├── assignments.ts             # Assignment API calls
│   │   │   ├── submissions.ts             # Submission API calls
│   │   │   └── submission-attachments.ts  # Attachment API calls
│   │   │
│   │   ├── constants.ts                   # API base URL, roles, status labels
│   │   ├── utils.ts                       # formatDate, cn() class merger, etc.
│   │   └── validators.ts                  # Zod schemas for form validation
│   │
│   ├── stores/                            # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── user-store.ts
│   │   ├── academic-term-store.ts
│   │   ├── batch-store.ts
│   │   ├── course-store.ts
│   │   ├── course-enrollment-store.ts
│   │   ├── teacher-allocation-store.ts
│   │   ├── assignment-store.ts
│   │   ├── submission-store.ts
│   │   └── submission-attachment-store.ts
│   │
│   └── types/                             # TypeScript type definitions
│       ├── auth.ts
│       ├── user.ts
│       ├── academic-term.ts
│       ├── batch.ts
│       ├── course.ts
│       ├── course-enrollment.ts
│       ├── teacher-allocation.ts
│       ├── assignment.ts
│       ├── submission.ts
│       ├── submission-attachment.ts
│       └── enums.ts
│
├── public/
│   └── (static assets)
│
└── .env.local                             # NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 4. Design Tokens — `src/app/globals.css`

Using Tailwind CSS v4's CSS-first `@theme` configuration with OKLCH colors, dark mode support, and semantic design tokens.

```css
@import "tailwindcss";

@theme {
  /* --- Color Tokens (OKLCH) --- */
  --color-background: oklch(98% 0.005 264);
  --color-foreground: oklch(14.5% 0.025 264);
  --color-surface: oklch(100% 0 0);
  --color-surface-hover: oklch(96.5% 0.008 264);

  --color-primary: oklch(52% 0.19 260);
  --color-primary-foreground: oklch(98% 0.005 264);
  --color-primary-hover: oklch(46% 0.19 260);

  --color-secondary: oklch(94% 0.015 264);
  --color-secondary-foreground: oklch(25% 0.025 264);

  --color-muted: oklch(95% 0.008 264);
  --color-muted-foreground: oklch(50% 0.02 264);

  --color-accent: oklch(92% 0.03 260);
  --color-accent-foreground: oklch(30% 0.06 260);

  --color-destructive: oklch(55% 0.22 27);
  --color-destructive-foreground: oklch(98% 0.005 27);

  --color-success: oklch(62% 0.19 145);
  --color-success-foreground: oklch(98% 0.005 145);

  --color-warning: oklch(75% 0.15 70);
  --color-warning-foreground: oklch(25% 0.06 70);

  --color-border: oklch(90% 0.01 264);
  --color-ring: oklch(52% 0.19 260);
  --color-input: oklch(90% 0.01 264);

  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(14.5% 0.025 264);

  --color-sidebar: oklch(16% 0.03 264);
  --color-sidebar-foreground: oklch(90% 0.01 264);
  --color-sidebar-hover: oklch(22% 0.03 264);
  --color-sidebar-active: oklch(52% 0.19 260);

  /* --- Radius --- */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* --- Shadows --- */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0% 0 0 / 0.07), 0 2px 4px -2px oklch(0% 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px oklch(0% 0 0 / 0.08), 0 4px 6px -4px oklch(0% 0 0 / 0.04);

  /* --- Animations --- */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-up: slide-up 0.25s ease-out;
  --animate-scale-in: scale-in 0.15s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(0.5rem); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}

@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-background: oklch(12% 0.02 264);
  --color-foreground: oklch(95% 0.005 264);
  --color-surface: oklch(16% 0.025 264);
  --color-surface-hover: oklch(20% 0.025 264);

  --color-primary: oklch(62% 0.19 260);
  --color-primary-foreground: oklch(12% 0.02 264);
  --color-primary-hover: oklch(56% 0.19 260);

  --color-secondary: oklch(20% 0.02 264);
  --color-secondary-foreground: oklch(90% 0.01 264);

  --color-muted: oklch(20% 0.015 264);
  --color-muted-foreground: oklch(60% 0.015 264);

  --color-border: oklch(24% 0.02 264);
  --color-ring: oklch(62% 0.19 260);
  --color-input: oklch(24% 0.02 264);

  --color-card: oklch(16% 0.025 264);
  --color-card-foreground: oklch(95% 0.005 264);

  --color-sidebar: oklch(10% 0.02 264);
  --color-sidebar-foreground: oklch(85% 0.01 264);
  --color-sidebar-hover: oklch(18% 0.025 264);
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground antialiased; }
}
```

---

## 5. TypeScript Type Definitions — `src/types/`

### 5.1 `types/enums.ts`

```typescript
export type UserRole = 'Admin' | 'Teacher' | 'Student';
export type EnrollmentStatus = 'Active' | 'Inactive';
export type TeacherCourseAllocationStatus = 'Active' | 'Inactive';
export type AssignmentStatus = 'Draft' | 'Published';
export type SubmissionStatus = 'Submitted' | 'Late' | 'Reviewed' | 'Returned';
```

### 5.2 `types/auth.ts`

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
```

### 5.3 `types/user.ts`

```typescript
export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
}

export interface SetActiveStatusRequest {
  isActive: boolean;
}

export interface ChangePasswordRequest {
  newPassword: string;
}
```

### 5.4 `types/academic-term.ts`

```typescript
export interface AcademicTermResponse {
  id: string;
  code: string;
  startsOn: string;  // DateOnly serialized as ISO string
  endsOn: string;
}

export interface CreateAcademicTermRequest {
  code: string;
  startsOn: string;
  endsOn: string;
}

export interface UpdateAcademicTermRequest {
  code: string;
  startsOn: string;
  endsOn: string;
}
```

### 5.5 `types/batch.ts`

```typescript
export interface BatchResponse {
  id: string;
  termId: string;
  termCode: string;
  code: string;
  name: string;
}

export interface CreateBatchRequest {
  termId: string;
  code: string;
  name: string;
}

export interface UpdateBatchRequest {
  code: string;
  name: string;
}

export interface AssignStudentRequest {
  studentId: string;
}

export interface SetBatchEnrollmentStatusRequest {
  status: EnrollmentStatus;
}

export interface BatchStudentResponse {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: string;
}
```

### 5.6 `types/course.ts`

```typescript
export interface CourseResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
}

export interface CreateCourseRequest {
  code: string;
  title: string;
  description?: string;
}

export interface UpdateCourseRequest {
  code: string;
  title: string;
  description?: string;
}
```

### 5.7 `types/course-enrollment.ts`

```typescript
export interface EnrollStudentsRequest {
  courseId: string;
  batchEnrollmentIds: string[];
}

export interface SetCourseEnrollmentStatusRequest {
  status: EnrollmentStatus;
}

export interface CourseStudentResponse {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  batchCode: string;
  status: string;
}

export interface StudentCourseResponse {
  enrollmentId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  status: string;
}
```

### 5.8 `types/teacher-allocation.ts`

```typescript
export interface AllocateTeacherRequest {
  teacherId: string;
  courseId: string;
}

export interface SetAllocationStatusRequest {
  status: TeacherCourseAllocationStatus;
}

export interface CourseTeacherResponse {
  allocationId: string;
  teacherId: string;
  teacherName: string;
  status: string;
}

export interface TeacherCourseResponse {
  allocationId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  status: string;
}
```

### 5.9 `types/assignment.ts`

```typescript
export interface AssignmentResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string | null;
  deadlineAt: string;
  maximumMarks: number;
  status: string;
  allowResubmission: boolean;
  createdByName: string;
}

export interface CreateAssignmentRequest {
  courseId: string;
  title: string;
  description?: string;
  deadlineAt: string;
  maximumMarks: number;
  allowResubmission: boolean;
}

export interface UpdateAssignmentRequest {
  title: string;
  description?: string;
  deadlineAt: string;
  maximumMarks: number;
  allowResubmission: boolean;
}
```

### 5.10 `types/submission.ts`

```typescript
export interface SubmissionResponse {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  answerText: string | null;
  status: string;
  submittedAt: string;
  marks: number | null;
  feedback: string | null;
  attachments: AttachmentResponse[];
}

export interface UpsertSubmissionRequest {
  answerText?: string;
}

export interface ReviewSubmissionRequest {
  marks: number;
  feedback?: string;
  status: SubmissionStatus;
}
```

### 5.11 `types/submission-attachment.ts`

```typescript
export interface AttachmentResponse {
  id: string;
  originalFileName: string;
  contentType: string;
  byteSize: number;
}
```

---

## 6. API Client Layer — `src/lib/api/`

### 6.1 `client.ts` — Base Fetch Wrapper

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',             // Send auth cookie
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new ApiError(res.status, error.title ?? 'Request failed', error.detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public detail?: string) {
    super(message);
  }
}
```

### 6.2 `auth.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `login(data)` | `POST` | `/api/auth/login` | `AuthController.Login` |
| `logout()` | `POST` | `/api/auth/logout` | `AuthController.Logout` |
| `getMe()` | `GET` | `/api/auth/me` | `AuthController.Me` |

### 6.3 `users.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getUsers(role?)` | `GET` | `/api/users?role={role}` | `UsersController.GetAll` |
| `getUserById(id)` | `GET` | `/api/users/{id}` | `UsersController.GetById` |
| `createUser(data)` | `POST` | `/api/users` | `UsersController.Create` |
| `updateUser(id, data)` | `PUT` | `/api/users/{id}` | `UsersController.Update` |
| `setActiveStatus(id, data)` | `PATCH` | `/api/users/{id}/active-status` | `UsersController.SetActiveStatus` |
| `changePassword(id, data)` | `PATCH` | `/api/users/{id}/password` | `UsersController.ChangePassword` |

### 6.4 `academic-terms.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getTerms()` | `GET` | `/api/academic-terms` | `AcademicTermsController.GetAll` |
| `getTermById(id)` | `GET` | `/api/academic-terms/{id}` | `AcademicTermsController.GetById` |
| `createTerm(data)` | `POST` | `/api/academic-terms` | `AcademicTermsController.Create` |
| `updateTerm(id, data)` | `PUT` | `/api/academic-terms/{id}` | `AcademicTermsController.Update` |
| `deleteTerm(id)` | `DELETE` | `/api/academic-terms/{id}` | `AcademicTermsController.Delete` |

### 6.5 `batches.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getBatches()` | `GET` | `/api/batches` | `BatchesController.GetAll` |
| `getBatchById(id)` | `GET` | `/api/batches/{id}` | `BatchesController.GetById` |
| `createBatch(data)` | `POST` | `/api/batches` | `BatchesController.Create` |
| `updateBatch(id, data)` | `PUT` | `/api/batches/{id}` | `BatchesController.Update` |
| `deleteBatch(id)` | `DELETE` | `/api/batches/{id}` | `BatchesController.Delete` |
| `getBatchStudents(id)` | `GET` | `/api/batches/{id}/students` | `BatchesController.GetStudents` |
| `assignStudent(id, data)` | `POST` | `/api/batches/{id}/students` | `BatchesController.AssignStudent` |
| `setBatchEnrollmentStatus(batchId, enrollmentId, data)` | `PATCH` | `/api/batches/{batchId}/enrollments/{enrollmentId}/status` | `BatchesController.SetStudentEnrollmentStatus` |

### 6.6 `courses.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getCourses()` | `GET` | `/api/courses` | `CoursesController.GetAll` |
| `getCourseById(id)` | `GET` | `/api/courses/{id}` | `CoursesController.GetById` |
| `createCourse(data)` | `POST` | `/api/courses` | `CoursesController.Create` |
| `updateCourse(id, data)` | `PUT` | `/api/courses/{id}` | `CoursesController.Update` |
| `deleteCourse(id)` | `DELETE` | `/api/courses/{id}` | `CoursesController.Delete` |

### 6.7 `course-enrollments.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getCourseStudents(courseId)` | `GET` | `/api/course-enrollments/courses/{courseId}/students` | `CourseEnrollmentsController.GetCourseStudents` |
| `getStudentCourses(studentId)` | `GET` | `/api/course-enrollments/students/{studentId}/courses` | `CourseEnrollmentsController.GetStudentCourses` |
| `enrollStudents(data)` | `POST` | `/api/course-enrollments` | `CourseEnrollmentsController.EnrollStudents` |
| `setCourseEnrollmentStatus(enrollmentId, data)` | `PATCH` | `/api/course-enrollments/{enrollmentId}/status` | `CourseEnrollmentsController.SetStatus` |

### 6.8 `teacher-allocations.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getCourseTeachers(courseId)` | `GET` | `/api/teacher-allocations/courses/{courseId}/teachers` | `TeacherCourseAllocationsController.GetCourseTeachers` |
| `getTeacherCourses(teacherId)` | `GET` | `/api/teacher-allocations/teachers/{teacherId}/courses` | `TeacherCourseAllocationsController.GetTeacherCourses` |
| `allocateTeacher(data)` | `POST` | `/api/teacher-allocations` | `TeacherCourseAllocationsController.AllocateTeacher` |
| `setAllocationStatus(allocationId, data)` | `PATCH` | `/api/teacher-allocations/{allocationId}/status` | `TeacherCourseAllocationsController.SetStatus` |

### 6.9 `assignments.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getAssignments(courseId?)` | `GET` | `/api/assignments?courseId={courseId}` | `AssignmentsController.GetAll` |
| `getAssignmentById(id)` | `GET` | `/api/assignments/{id}` | `AssignmentsController.GetById` |
| `createAssignment(data)` | `POST` | `/api/assignments` | `AssignmentsController.Create` |
| `updateAssignment(id, data)` | `PUT` | `/api/assignments/{id}` | `AssignmentsController.Update` |
| `publishAssignment(id)` | `PATCH` | `/api/assignments/{id}/publish` | `AssignmentsController.Publish` |
| `deleteAssignment(id)` | `DELETE` | `/api/assignments/{id}` | `AssignmentsController.Delete` |

### 6.10 `submissions.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `getMySubmissions()` | `GET` | `/api/submissions/mine` | `SubmissionsController.GetMine` |
| `getAssignmentSubmissions(assignmentId)` | `GET` | `/api/submissions/assignments/{assignmentId}` | `SubmissionsController.GetForAssignment` |
| `getSubmissionById(id)` | `GET` | `/api/submissions/{id}` | `SubmissionsController.GetById` |
| `submitOrUpdate(assignmentId, data)` | `POST` | `/api/submissions/assignments/{assignmentId}` | `SubmissionsController.SubmitOrUpdate` |
| `reviewSubmission(id, data)` | `PATCH` | `/api/submissions/{id}/review` | `SubmissionsController.Review` |

### 6.11 `submission-attachments.ts`

| Function | HTTP | Endpoint | Maps to Controller Action |
|---|---|---|---|
| `uploadAttachment(submissionId, file)` | `POST` | `/api/submission-attachments/submissions/{submissionId}` | `SubmissionAttachmentsController.Upload` |
| `downloadAttachment(attachmentId)` | `GET` | `/api/submission-attachments/{attachmentId}` | `SubmissionAttachmentsController.Download` |
| `deleteAttachment(attachmentId)` | `DELETE` | `/api/submission-attachments/{attachmentId}` | `SubmissionAttachmentsController.Delete` |

> **Note**: `uploadAttachment` uses `FormData` instead of JSON. `downloadAttachment` returns a `Blob`.

---

## 7. Zustand Stores — `src/stores/`

Each store follows the Zustand slice pattern from the skill. Stores hold **server state cache + loading/error flags** and expose **async actions** that call the API client. UI components subscribe to stores via selectors.

---

### 7.1 `auth-store.ts`

```typescript
interface AuthState {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;
```

**Key behaviors**:
- `login` → calls `authApi.login()`, then `fetchMe()`. On success, sets `user` and `isAuthenticated = true`.
- `logout` → calls `authApi.logout()`, clears `user`, sets `isAuthenticated = false`.
- `fetchMe` → calls `authApi.getMe()`. Used on app mount to restore session from cookie. On 401, silently clears state.

---

### 7.2 `user-store.ts`

```typescript
interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  isLoading: boolean;
}

interface UserActions {
  fetchUsers: (role?: UserRole) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<void>;
  setActiveStatus: (id: string, data: SetActiveStatusRequest) => Promise<void>;
  changePassword: (id: string, data: ChangePasswordRequest) => Promise<void>;
}
```

---

### 7.3 `academic-term-store.ts`

```typescript
interface AcademicTermState {
  terms: AcademicTermResponse[];
  isLoading: boolean;
}

interface AcademicTermActions {
  fetchTerms: () => Promise<void>;
  createTerm: (data: CreateAcademicTermRequest) => Promise<void>;
  updateTerm: (id: string, data: UpdateAcademicTermRequest) => Promise<void>;
  deleteTerm: (id: string) => Promise<void>;
}
```

---

### 7.4 `batch-store.ts`

```typescript
interface BatchState {
  batches: BatchResponse[];
  selectedBatch: BatchResponse | null;
  students: BatchStudentResponse[];
  isLoading: boolean;
}

interface BatchActions {
  fetchBatches: () => Promise<void>;
  fetchBatchById: (id: string) => Promise<void>;
  createBatch: (data: CreateBatchRequest) => Promise<void>;
  updateBatch: (id: string, data: UpdateBatchRequest) => Promise<void>;
  deleteBatch: (id: string) => Promise<void>;
  fetchBatchStudents: (batchId: string) => Promise<void>;
  assignStudent: (batchId: string, data: AssignStudentRequest) => Promise<void>;
  setBatchEnrollmentStatus: (batchId: string, enrollmentId: string, data: SetBatchEnrollmentStatusRequest) => Promise<void>;
}
```

---

### 7.5 `course-store.ts`

```typescript
interface CourseState {
  courses: CourseResponse[];
  selectedCourse: CourseResponse | null;
  isLoading: boolean;
}

interface CourseActions {
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  createCourse: (data: CreateCourseRequest) => Promise<void>;
  updateCourse: (id: string, data: UpdateCourseRequest) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}
```

---

### 7.6 `course-enrollment-store.ts`

```typescript
interface CourseEnrollmentState {
  courseStudents: CourseStudentResponse[];
  studentCourses: StudentCourseResponse[];
  isLoading: boolean;
}

interface CourseEnrollmentActions {
  fetchCourseStudents: (courseId: string) => Promise<void>;
  fetchStudentCourses: (studentId: string) => Promise<void>;
  enrollStudents: (data: EnrollStudentsRequest) => Promise<void>;
  setStatus: (enrollmentId: string, data: SetCourseEnrollmentStatusRequest) => Promise<void>;
}
```

---

### 7.7 `teacher-allocation-store.ts`

```typescript
interface TeacherAllocationState {
  courseTeachers: CourseTeacherResponse[];
  teacherCourses: TeacherCourseResponse[];
  isLoading: boolean;
}

interface TeacherAllocationActions {
  fetchCourseTeachers: (courseId: string) => Promise<void>;
  fetchTeacherCourses: (teacherId: string) => Promise<void>;
  allocateTeacher: (data: AllocateTeacherRequest) => Promise<void>;
  setStatus: (allocationId: string, data: SetAllocationStatusRequest) => Promise<void>;
}
```

---

### 7.8 `assignment-store.ts`

```typescript
interface AssignmentState {
  assignments: AssignmentResponse[];
  selectedAssignment: AssignmentResponse | null;
  isLoading: boolean;
}

interface AssignmentActions {
  fetchAssignments: (courseId?: string) => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<void>;
  createAssignment: (data: CreateAssignmentRequest) => Promise<void>;
  updateAssignment: (id: string, data: UpdateAssignmentRequest) => Promise<void>;
  publishAssignment: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
}
```

---

### 7.9 `submission-store.ts`

```typescript
interface SubmissionState {
  mySubmissions: SubmissionResponse[];
  assignmentSubmissions: SubmissionResponse[];
  selectedSubmission: SubmissionResponse | null;
  isLoading: boolean;
}

interface SubmissionActions {
  fetchMySubmissions: () => Promise<void>;
  fetchAssignmentSubmissions: (assignmentId: string) => Promise<void>;
  fetchSubmissionById: (id: string) => Promise<void>;
  submitOrUpdate: (assignmentId: string, data: UpsertSubmissionRequest) => Promise<void>;
  reviewSubmission: (id: string, data: ReviewSubmissionRequest) => Promise<void>;
}
```

---

### 7.10 `submission-attachment-store.ts`

```typescript
interface SubmissionAttachmentState {
  isUploading: boolean;
}

interface SubmissionAttachmentActions {
  uploadAttachment: (submissionId: string, file: File) => Promise<AttachmentResponse>;
  downloadAttachment: (attachmentId: string) => Promise<void>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
}
```

---

## 8. Form Validation — `src/lib/validators.ts`

Zod schemas used with `react-hook-form` via `@hookform/resolvers/zod`:

| Schema | Fields | Used In |
|---|---|---|
| `loginSchema` | email (email), password (min 1) | LoginForm |
| `createUserSchema` | fullName, email, password (min 6), role | UserForm (create) |
| `updateUserSchema` | fullName, email | UserForm (edit) |
| `changePasswordSchema` | newPassword (min 6) | ChangePasswordModal |
| `termSchema` | code, startsOn, endsOn (endsOn > startsOn) | TermFormModal |
| `batchSchema` | termId, code, name | BatchFormModal |
| `courseSchema` | code, title, description? | CourseFormModal |
| `assignmentSchema` | courseId, title, description?, deadlineAt (future), maximumMarks (> 0), allowResubmission | AssignmentForm |
| `submissionSchema` | answerText? | SubmissionForm |
| `reviewSchema` | marks (0..max), feedback?, status (Reviewed/Returned) | ReviewForm |
| `enrollStudentsSchema` | courseId, batchEnrollmentIds (min 1) | EnrollStudentsModal |
| `allocateTeacherSchema` | teacherId, courseId | AllocateTeacherModal |

---

## 9. UI Components — `src/components/ui/`

### 9.1 Component List & Props

| Component | Key Props | Description |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'destructive' \| 'ghost' \| 'outline'`, `size: 'sm' \| 'md' \| 'lg'`, `isLoading` | Accessible button with loading spinner |
| `Input` | `label`, `error`, extends `<input>` | Form input with label and validation error |
| `Textarea` | `label`, `error`, extends `<textarea>` | Multi-line input |
| `Select` | `label`, `error`, `options: {value, label}[]` | Dropdown select |
| `Badge` | `variant: 'default' \| 'success' \| 'warning' \| 'destructive' \| 'outline'` | Status label |
| `Card` | `children`, `className` | Content container |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Dialog overlay |
| `Table` | `columns: Column[]`, `data: T[]`, `onRowClick?` | Data table with headers |
| `Spinner` | `size: 'sm' \| 'md' \| 'lg'` | Loading indicator |
| `EmptyState` | `icon`, `title`, `description`, `action?` | Empty collection placeholder |
| `ConfirmDialog` | `isOpen`, `onConfirm`, `onCancel`, `title`, `message`, `variant` | Destructive action confirmation |
| `FileUpload` | `onFileSelect`, `accept`, `maxSize` | Drag-and-drop file input |
| `StatusBadge` | `status: string` | Maps status strings to colored Badge |
| `DatePicker` | `value`, `onChange`, `label`, `error` | Date input (native `type="date"` styled) |

---

## 10. Layout Components — `src/components/layout/`

### 10.1 `Sidebar.tsx`

- Fixed left panel (w-64 on desktop, collapsible on mobile).
- Renders `SidebarItem` components conditionally by user role:

| Menu Item | Route | Visible To |
|---|---|---|
| Dashboard | `/dashboard` | All |
| Users | `/users` | Admin |
| Academic Terms | `/academic-terms` | Admin |
| Batches | `/batches` | Admin |
| Courses | `/courses` | Admin |
| Assignments | `/assignments` | Teacher, Student |
| My Submissions | `/submissions` | Student |

- Active state highlighted with `bg-sidebar-active` token.
- User info + logout button at bottom.

### 10.2 `Navbar.tsx`

- Top bar with page title, breadcrumbs, and user avatar/role badge.
- Dark mode toggle button.

### 10.3 `PageHeader.tsx`

- Reusable component: title, optional description, and action button (e.g., "Create User").

---

## 11. `AuthGuard` Component — `src/components/auth/AuthGuard.tsx`

```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
```

- Wraps protected route layouts.
- On mount, calls `authStore.fetchMe()` if `user` is null.
- If not authenticated → redirect to `/login`.
- If `allowedRoles` specified and user's role not in list → redirect to `/dashboard` with toast.
- Shows `<Spinner>` while loading.

---

## 12. Page Descriptions

### 12.1 Login Page — `/(auth)/login/page.tsx`

- Centered card with email + password fields.
- Uses `LoginForm` component + `loginSchema` validator.
- On success, `authStore.login()` → redirect to `/dashboard`.
- Error toast on invalid credentials.

### 12.2 Dashboard — `/(dashboard)/dashboard/page.tsx`

Renders a **role-specific dashboard** component:

| Role | Component | Content |
|---|---|---|
| Admin | `AdminDashboard` | Summary cards: total users, courses, batches, assignments. Quick links to admin pages. |
| Teacher | `TeacherDashboard` | Allocated courses list, recent assignments, pending submissions to review count. |
| Student | `StudentDashboard` | Enrolled courses, upcoming assignment deadlines, recent submission statuses. |

### 12.3 Users Page — `/(dashboard)/users/page.tsx` (Admin)

- `PageHeader` with "Create User" button.
- `UserTable` with columns: Name, Email, Role, Status, Actions.
- Role filter dropdown.
- Row actions: Edit, Change Password, Toggle Active.
- "Create User" → modal with `UserForm`.

### 12.4 User Detail — `/(dashboard)/users/[id]/page.tsx` (Admin)

- Full user profile view + inline edit form.
- Change password section.
- Active/Inactive toggle.

### 12.5 Academic Terms — `/(dashboard)/academic-terms/page.tsx` (Admin)

- `TermTable` with columns: Code, Start, End, Actions.
- Create/Edit via `TermFormModal`.
- Delete with `ConfirmDialog` (warns if batches exist).

### 12.6 Batches — `/(dashboard)/batches/page.tsx` (Admin)

- `BatchTable` with columns: Code, Name, Term, Actions.
- Create/Edit via `BatchFormModal`.

### 12.7 Batch Detail — `/(dashboard)/batches/[id]/page.tsx` (Admin)

- Batch info card.
- `BatchStudentTable`: enrolled students with status badge.
- "Assign Student" button → `AssignStudentModal` (searchable student dropdown).
- Toggle enrollment status per student.

### 12.8 Courses — `/(dashboard)/courses/page.tsx` (Admin)

- `CourseTable` with columns: Code, Title, Actions.
- Create/Edit via `CourseFormModal`.

### 12.9 Course Detail — `/(dashboard)/courses/[id]/page.tsx` (Admin)

- Course info card.
- Two tabs:
  - **Students**: `CourseStudentTable` + "Enroll Students" → `EnrollStudentsModal` (select batch → checkboxes for active members → enroll).
  - **Teachers**: `CourseTeacherTable` + "Allocate Teacher" → `AllocateTeacherModal`.
- Toggle enrollment/allocation status.

### 12.10 Assignments — `/(dashboard)/assignments/page.tsx` (Teacher + Student)

- **Teacher view**: lists their assignments across allocated courses. Filter by course. Shows Draft/Published status. Actions: Edit, Publish, Delete, View Submissions.
- **Student view**: lists published assignments for enrolled courses. Shows deadline, status. Click → view details and submit.
- Uses `AssignmentCard` or `AssignmentList` depending on viewport.

### 12.11 Create Assignment — `/(dashboard)/assignments/create/page.tsx` (Teacher)

- `AssignmentForm` with course selector (from allocated courses), title, description (rich text), deadline, max marks, resubmission toggle.
- Saves as Draft by default.

### 12.12 Assignment Detail — `/(dashboard)/assignments/[id]/page.tsx`

- **Student**: sees title, description, deadline, max marks. If no submission → `SubmissionForm`. If submitted → view status + submission details.
- **Teacher**: sees full assignment info + "View Submissions" link.

### 12.13 Edit Assignment — `/(dashboard)/assignments/[id]/edit/page.tsx` (Teacher)

- Pre-filled `AssignmentForm`. Only available for Draft or Published-with-no-submissions.

### 12.14 Assignment Submissions — `/(dashboard)/assignments/[id]/submissions/page.tsx` (Teacher/Admin)

- `SubmissionTable` with columns: Student, Status, Submitted At, Marks, Actions.
- Click row → submission detail with `ReviewForm`.

### 12.15 My Submissions — `/(dashboard)/submissions/page.tsx` (Student)

- Table of student's own submissions across all assignments.
- Columns: Assignment Title, Course, Status, Marks, Submitted At.

### 12.16 Submission Detail — `/(dashboard)/submissions/[id]/page.tsx`

- **Student**: sees answer, status, marks, feedback, attachments. Can upload/delete attachments if before deadline.
- **Teacher**: sees student answer, attachments. `ReviewForm` to assign marks + feedback + set status (Reviewed/Returned).

---

## 13. Routing & Navigation Map

```
/                           → Redirect to /login or /dashboard
/login                      → Login page

/dashboard                  → Role-based dashboard

/users                      → [Admin] User management
/users/[id]                 → [Admin] User detail

/academic-terms             → [Admin] Term management

/batches                    → [Admin] Batch management
/batches/[id]               → [Admin] Batch detail + students

/courses                    → [Admin] Course management
/courses/[id]               → [Admin] Course detail (students + teachers)

/assignments                → [Teacher, Student] Assignment list
/assignments/create         → [Teacher] Create assignment
/assignments/[id]           → [All] Assignment detail
/assignments/[id]/edit      → [Teacher] Edit assignment
/assignments/[id]/submissions → [Teacher, Admin] Submissions list

/submissions                → [Student] My submissions
/submissions/[id]           → [All] Submission detail
```

---

## 14. Middleware — `src/middleware.ts`

Next.js edge middleware for route protection:

```typescript
export function middleware(request: NextRequest) {
  // Protected routes: everything under /(dashboard)/
  // If no auth cookie present → redirect to /login
  // /login with auth cookie → redirect to /dashboard
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

> **Note**: Cookie presence check only; actual role authorization is enforced by the backend and `AuthGuard` component.

---

## 15. Next.js Configuration — `next.config.ts`

```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',   // Proxy to backend
      },
    ];
  },
};
```

> If using proxy, `apiClient` base URL becomes empty string `''`. Otherwise, use `NEXT_PUBLIC_API_URL`.

---

## 16. Summary Counts

| Category | Count |
|---|---|
| Pages (routes) | 16 |
| UI Components (primitives) | 14 |
| Layout Components | 4 |
| Feature Components | 25 |
| Dashboard Components | 3 |
| API Client Functions | 40 |
| Zustand Stores | 10 |
| Store Actions (total) | 47 |
| TypeScript Type Files | 11 |
| Zod Validation Schemas | 12 |

---

## 17. Implementation Order

| Phase | What to Build | Key Files |
|---|---|---|
| **1. Scaffold** | Initialize Next.js project, install dependencies, configure Tailwind v4 `globals.css` theme tokens, `next.config.ts` proxy | `package.json`, `globals.css`, `next.config.ts`, `postcss.config.mjs` |
| **2. Foundation** | Types (`src/types/*`), API client (`src/lib/api/*`), constants, utility functions | `src/types/*`, `src/lib/*` |
| **3. Design System** | All UI primitives (`src/components/ui/*`) | `Button`, `Input`, `Modal`, `Table`, `Badge`, etc. |
| **4. Auth** | Auth store, LoginForm, AuthGuard, root layout, auth layout, middleware | `stores/auth-store.ts`, `components/auth/*`, `app/(auth)/*`, `middleware.ts` |
| **5. Layout Shell** | Sidebar, Navbar, PageHeader, dashboard layout with AuthGuard | `components/layout/*`, `app/(dashboard)/layout.tsx` |
| **6. Dashboard** | Dashboard page + 3 role-specific dashboard components | `app/(dashboard)/dashboard/*`, `components/dashboard/*` |
| **7. Admin — Users** | User store, UserTable, UserForm, ChangePasswordModal, user pages | `stores/user-store.ts`, `components/users/*`, `app/(dashboard)/users/*` |
| **8. Admin — Terms & Batches** | Term + Batch stores, tables, modals, pages | `stores/academic-term-store.ts`, `stores/batch-store.ts`, `components/academic-terms/*`, `components/batches/*`, corresponding pages |
| **9. Admin — Courses** | Course + Enrollment + Allocation stores, course detail with tabs, enroll/allocate modals | `stores/course-store.ts`, `stores/course-enrollment-store.ts`, `stores/teacher-allocation-store.ts`, `components/courses/*`, pages |
| **10. Assignments** | Assignment store, card/list/form/detail components, create/edit/list pages | `stores/assignment-store.ts`, `components/assignments/*`, `app/(dashboard)/assignments/*` |
| **11. Submissions** | Submission + Attachment stores, form/table/detail/review components, pages | `stores/submission-store.ts`, `stores/submission-attachment-store.ts`, `components/submissions/*`, `app/(dashboard)/submissions/*` |
| **12. Polish** | Dark mode toggle, responsive breakpoints, loading skeletons, error boundaries, accessibility audit | Various |
| **13. Test** | E2E tests with Playwright or Cypress for key user flows | `tests/` or `e2e/` |

---

## 18. Key Architectural Decisions

### 18.1 State Management Strategy

- **Zustand stores hold server-state caches** — fetched data is stored in the store and re-fetched on navigation or after mutations.
- **No global loading overlay** — each store has its own `isLoading` flag; components show skeletons or spinners per section.
- **Optimistic updates avoided for destructive ops** (delete, status toggle) — wait for backend confirmation, then refresh.
- **Store selectors** — components use `useStore(store, selector)` to subscribe to only the fields they need, minimizing re-renders (per `rerender-derived-state` rule).

### 18.2 Composition Patterns

- Compound components for complex UI (e.g., `Table` with `Table.Head`, `Table.Body`, `Table.Row`) following the `architecture-compound-components` skill.
- Explicit variant components instead of boolean props (e.g., separate `PrimaryButton`, `DestructiveButton` as `Button` variants) per `architecture-avoid-boolean-props`.
- `children` over render props per `patterns-children-over-render-props`.

### 18.3 Performance

- `next/dynamic` for heavy components (file upload, rich text) per `bundle-dynamic-imports`.
- Direct imports, no barrel files per `bundle-barrel-imports`.
- `Promise.all()` for parallel API calls on pages that need multiple data sources per `async-parallel`.
- Functional `setState` for stable callbacks per `rerender-functional-setstate`.

### 18.4 Auth Flow

1. User visits any protected route → `middleware.ts` checks for auth cookie → redirects to `/login` if missing.
2. `AuthGuard` component on mount calls `fetchMe()` → backend validates cookie → returns `CurrentUser` or 401.
3. On 401, `AuthGuard` clears store and redirects to `/login`.
4. On successful login, backend sets `HttpOnly` cookie → subsequent requests include it via `credentials: 'include'`.
5. Logout clears cookie server-side → `AuthGuard` detects on next route change.
