import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  roll: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Teacher", "Student"], {
    required_error: "Please select a role",
  }),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  roll: z.string().optional().nullable(),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const termSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    startsOn: z.string().min(1, "Start date is required"),
    endsOn: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.endsOn > data.startsOn, {
    message: "End date must be after start date",
    path: ["endsOn"],
  });

export const batchSchema = z.object({
  termId: z.string().min(1, "Please select an academic term"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
});

export const courseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
});

export const assignmentSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  deadlineAt: z.string().min(1, "Deadline is required"),
  maximumMarks: z.coerce
    .number()
    .min(1, "Maximum marks must be at least 1"),
  allowResubmission: z.boolean(),
});

export const submissionSchema = z.object({
  answerText: z.string().optional().nullable(),
});

export const reviewSchema = z.object({
  marks: z.coerce.number().min(0, "Marks cannot be negative"),
  feedback: z.string().optional().nullable(),
  status: z.enum(["Reviewed", "Returned"], {
    required_error: "Please select a status",
  }),
});

export const enrollStudentsSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  batchEnrollmentIds: z
    .array(z.string())
    .min(1, "Select at least one student"),
});

export const allocateTeacherSchema = z.object({
  teacherId: z.string().min(1, "Please select a teacher"),
  courseId: z.string().min(1, "Course is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type TermFormData = z.infer<typeof termSchema>;
export type BatchFormData = z.infer<typeof batchSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
export type SubmissionFormData = z.infer<typeof submissionSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type EnrollStudentsFormData = z.infer<typeof enrollStudentsSchema>;
export type AllocateTeacherFormData = z.infer<typeof allocateTeacherSchema>;
