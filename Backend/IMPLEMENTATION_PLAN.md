# Backend Detailed Implementation Plan

> **Project**: Assignment & Submission Management System — ASP.NET Core 10 Web API  
> **Solution**: `OnnorokomBackend.slnx` → `OnnoRokomBackend.csproj`  
> **Runtime**: .NET 10 · PostgreSQL · EF Core (Npgsql) · JWT Bearer Authentication  
> **Reference**: [PLAN.md](file:///d:/C_Sharp_projects/Onnoroom/PLAN.md) · [Requirements](file:///d:/C_Sharp_projects/Onnoroom/Assistant_Software_Engineer_Recruitment_Project.md) · [Concerns](file:///d:/C_Sharp_projects/Onnoroom/Concerns.md)

---

## 1. NuGet Packages to Install

| Package | Purpose |
|---|---|
| `Npgsql.EntityFrameworkCore.PostgreSQL` | EF Core provider for PostgreSQL |
| `Microsoft.EntityFrameworkCore.Design` | EF Core migrations CLI tooling |
| `Microsoft.EntityFrameworkCore.Tools` | `dotnet ef` commands |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT bearer-token authentication and validation |
| `BCrypt.Net-Next` | Password hashing |
| `Swashbuckle.AspNetCore` | Swagger / OpenAPI UI |

---

## 2. Final Folder Structure

All paths are relative to `Backend/OnnorokomBackend/`.

```
OnnorokomBackend/
│
├── Program.cs                              # Application entry point & DI wiring
├── appsettings.json                        # Base configuration
├── appsettings.Development.json            # Dev overrides (connection string)
├── OnnoRokomBackend.csproj
│
├── Models/
│   ├── Enums/
│   │   ├── UserRole.cs                     # Admin, Teacher, Student
│   │   ├── EnrollmentStatus.cs             # Active, Inactive
│   │   ├── TeacherCourseAllocationStatus.cs # Active, Inactive
│   │   ├── AssignmentStatus.cs             # Draft, Published
│   │   └── SubmissionStatus.cs             # Submitted, Late, Reviewed, Returned
│   │
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── AcademicTerm.cs
│   │   ├── AcademicBatch.cs
│   │   ├── Course.cs
│   │   ├── BatchEnrollment.cs
│   │   ├── CourseEnrollment.cs
│   │   ├── TeacherCourseAllocation.cs
│   │   ├── Assignment.cs
│   │   ├── Submission.cs
│   │   └── SubmissionAttachment.cs
│   │
│   └── DTOs/
│       ├── Auth/
│       │   ├── LoginRequest.cs
│       │   └── CurrentUserResponse.cs
│       ├── Users/
│       │   ├── CreateUserRequest.cs
│       │   ├── UpdateUserRequest.cs
│       │   ├── SetActiveStatusRequest.cs
│       │   ├── ChangePasswordRequest.cs
│       │   └── UserResponse.cs
│       ├── AcademicTerms/
│       │   ├── CreateAcademicTermRequest.cs
│       │   ├── UpdateAcademicTermRequest.cs
│       │   └── AcademicTermResponse.cs
│       ├── Batches/
│       │   ├── CreateBatchRequest.cs
│       │   ├── UpdateBatchRequest.cs
│       │   ├── AssignStudentRequest.cs
│       │   ├── SetBatchEnrollmentStatusRequest.cs
│       │   ├── BatchResponse.cs
│       │   └── BatchStudentResponse.cs
│       ├── Courses/
│       │   ├── CreateCourseRequest.cs
│       │   ├── UpdateCourseRequest.cs
│       │   └── CourseResponse.cs
│       ├── CourseEnrollments/
│       │   ├── EnrollStudentsRequest.cs
│       │   ├── SetCourseEnrollmentStatusRequest.cs
│       │   ├── CourseStudentResponse.cs
│       │   └── StudentCourseResponse.cs
│       ├── TeacherCourseAllocations/
│       │   ├── AllocateTeacherRequest.cs
│       │   ├── SetAllocationStatusRequest.cs
│       │   ├── CourseTeacherResponse.cs
│       │   └── TeacherCourseResponse.cs
│       ├── Assignments/
│       │   ├── CreateAssignmentRequest.cs
│       │   ├── UpdateAssignmentRequest.cs
│       │   └── AssignmentResponse.cs
│       ├── Submissions/
│       │   ├── UpsertSubmissionRequest.cs
│       │   ├── ReviewSubmissionRequest.cs
│       │   └── SubmissionResponse.cs
│       └── SubmissionAttachments/
│           └── AttachmentResponse.cs
│
├── DbContext/
│   ├── AppDbContext.cs                     # EF Core DbContext
│   └── Configurations/
│       ├── UserConfiguration.cs
│       ├── AcademicTermConfiguration.cs
│       ├── AcademicBatchConfiguration.cs
│       ├── CourseConfiguration.cs
│       ├── BatchEnrollmentConfiguration.cs
│       ├── CourseEnrollmentConfiguration.cs
│       ├── TeacherCourseAllocationConfiguration.cs
│       ├── AssignmentConfiguration.cs
│       ├── SubmissionConfiguration.cs
│       └── SubmissionAttachmentConfiguration.cs
│
├── UnitOfWork/
│   ├── IUnitOfWork.cs
│   └── UnitOfWork.cs
│
├── Services/
│   ├── Auth/
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs
│   ├── Users/
│   │   ├── IUserService.cs
│   │   └── UserService.cs
│   ├── AcademicTerms/
│   │   ├── IAcademicTermService.cs
│   │   └── AcademicTermService.cs
│   ├── Batches/
│   │   ├── IBatchService.cs
│   │   └── BatchService.cs
│   ├── Courses/
│   │   ├── ICourseService.cs
│   │   └── CourseService.cs
│   ├── CourseEnrollments/
│   │   ├── ICourseEnrollmentService.cs
│   │   └── CourseEnrollmentService.cs
│   ├── TeacherCourseAllocations/
│   │   ├── ITeacherCourseAllocationService.cs
│   │   └── TeacherCourseAllocationService.cs
│   ├── Assignments/
│   │   ├── IAssignmentService.cs
│   │   └── AssignmentService.cs
│   ├── Submissions/
│   │   ├── ISubmissionService.cs
│   │   └── SubmissionService.cs
│   └── SubmissionAttachments/
│       ├── ISubmissionAttachmentService.cs
│       └── SubmissionAttachmentService.cs
│
├── Controllers/
│   ├── Auth/
│   │   ├── IAuthController.cs
│   │   └── AuthController.cs
│   ├── Users/
│   │   ├── IUserController.cs
│   │   └── UsersController.cs
│   ├── AcademicTerms/
│   │   ├── IAcademicTermsController.cs
│   │   └── AcademicTermsController.cs
│   ├── Batches/
│   │   ├── IBatchController.cs
│   │   └── BatchesController.cs
│   ├── Courses/
│   │   ├── ICourseController.cs
│   │   └── CoursesController.cs
│   ├── CourseEnrollments/
│   │   ├── ICourseEnrollmentController.cs
│   │   └── CourseEnrollmentsController.cs
│   ├── TeacherCourseAllocations/
│   │   ├── ITeacherCourseAllocationController.cs
│   │   └── TeacherCourseAllocationsController.cs
│   ├── Assignments/
│   │   ├── IAssignmentController.cs
│   │   └── AssignmentsController.cs
│   ├── Submissions/
│   │   ├── ISubmissionController.cs
│   │   └── SubmissionsController.cs
│   └── SubmissionAttachments/
│       ├── ISubmissionAttachmentController.cs
│       └── SubmissionAttachmentsController.cs
│
├── Middleware/
│   └── GlobalExceptionMiddleware.cs        # Catches unhandled exceptions, returns ProblemDetails
│
├── Helpers/
│   └── ClaimsPrincipalExtensions.cs        # GetUserId(), GetUserRole() helper extension methods
│
├── Migrations/                             # Auto-generated by `dotnet ef migrations add`
│
└── Seed/
    └── SeedData.cs                         # Admin, Teacher, Student demo accounts + sample data
```

---

## 3. Entity Definitions

### 3.1 `Models/Enums/UserRole.cs`

```csharp
public enum UserRole { Admin, Teacher, Student }
```

### 3.2 `Models/Enums/EnrollmentStatus.cs`

```csharp
public enum EnrollmentStatus { Active, Inactive }
```

### 3.3 `Models/Enums/TeacherCourseAllocationStatus.cs`

```csharp
public enum TeacherCourseAllocationStatus { Active, Inactive }
```

### 3.4 `Models/Enums/AssignmentStatus.cs`

```csharp
public enum AssignmentStatus { Draft, Published }
```

### 3.5 `Models/Enums/SubmissionStatus.cs`

```csharp
public enum SubmissionStatus { Submitted, Late, Reviewed, Returned }
```

### 3.6 `Models/Entities/User.cs`

```csharp
public class User
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public int AuthVersion { get; set; } = 1;

    // Navigation
    public ICollection<BatchEnrollment> BatchEnrollments { get; set; } = [];
    public ICollection<TeacherCourseAllocation> TeacherCourseAllocations { get; set; } = [];
    public ICollection<Assignment> CreatedAssignments { get; set; } = [];
    public ICollection<Submission> Submissions { get; set; } = [];
}
```

### 3.7 `Models/Entities/AcademicTerm.cs`

```csharp
public class AcademicTerm
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }

    public ICollection<AcademicBatch> Batches { get; set; } = [];
}
```

### 3.8 `Models/Entities/AcademicBatch.cs`

```csharp
public class AcademicBatch
{
    public Guid Id { get; set; }
    public Guid TermId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public AcademicTerm Term { get; set; } = null!;
    public ICollection<BatchEnrollment> Enrollments { get; set; } = [];
}
```

### 3.9 `Models/Entities/Course.cs`

```csharp
public class Course
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = [];
    public ICollection<TeacherCourseAllocation> TeacherAllocations { get; set; } = [];
    public ICollection<Assignment> Assignments { get; set; } = [];
}
```

### 3.10 `Models/Entities/BatchEnrollment.cs`

```csharp
public class BatchEnrollment
{
    public Guid Id { get; set; }
    public Guid BatchId { get; set; }
    public Guid StudentId { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

    public AcademicBatch Batch { get; set; } = null!;
    public User Student { get; set; } = null!;
    public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = [];
}
```

### 3.11 `Models/Entities/CourseEnrollment.cs`

```csharp
public class CourseEnrollment
{
    public Guid Id { get; set; }
    public Guid BatchEnrollmentId { get; set; }
    public Guid CourseId { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

    public BatchEnrollment BatchEnrollment { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
```

### 3.12 `Models/Entities/TeacherCourseAllocation.cs`

```csharp
public class TeacherCourseAllocation
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public Guid CourseId { get; set; }
    public TeacherCourseAllocationStatus Status { get; set; } = TeacherCourseAllocationStatus.Active;

    public User Teacher { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
```

### 3.13 `Models/Entities/Assignment.cs`

```csharp
public class Assignment
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DeadlineAt { get; set; }
    public decimal MaximumMarks { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;
    public bool AllowResubmission { get; set; }
    public DateTime? SubmissionsClosedAt { get; set; }
    public DateTime? DeletedAt { get; set; }             // Soft delete

    public Course Course { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public ICollection<Submission> Submissions { get; set; } = [];
}
```

### 3.14 `Models/Entities/Submission.cs`

```csharp
public class Submission
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public string? AnswerText { get; set; }
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
    public DateTime SubmittedAt { get; set; }
    public decimal? Marks { get; set; }
    public string? Feedback { get; set; }
    public Guid? EvaluatedByUserId { get; set; }

    public Assignment Assignment { get; set; } = null!;
    public User Student { get; set; } = null!;
    public User? EvaluatedBy { get; set; }
    public ICollection<SubmissionAttachment> Attachments { get; set; } = [];
}
```

### 3.15 `Models/Entities/SubmissionAttachment.cs`

```csharp
public class SubmissionAttachment
{
    public Guid Id { get; set; }
    public Guid SubmissionId { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long ByteSize { get; set; }
    public byte[] FileData { get; set; } = [];

    public Submission Submission { get; set; } = null!;
}
```

---

## 4. DTO Definitions (Request / Response)

### 4.1 Auth DTOs

**`LoginRequest`**
```csharp
public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
```

**`CurrentUserResponse`**
```csharp
public class CurrentUserResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
```

**`AuthenticationResponse`**
```csharp
public class AuthenticationResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public CurrentUserResponse User { get; set; } = null!;
}
```

### 4.2 User DTOs

**`CreateUserRequest`**
```csharp
public class CreateUserRequest
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
    [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
    [Required] public UserRole Role { get; set; }
}
```

**`UpdateUserRequest`**
```csharp
public class UpdateUserRequest
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
}
```

**`SetActiveStatusRequest`**
```csharp
public class SetActiveStatusRequest
{
    public bool IsActive { get; set; }
}
```

**`ChangePasswordRequest`**
```csharp
public class ChangePasswordRequest
{
    [Required, MinLength(6)] public string NewPassword { get; set; } = string.Empty;
}
```

**`UserResponse`**
```csharp
public class UserResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
```

### 4.3 AcademicTerm DTOs

**`CreateAcademicTermRequest`**
```csharp
public class CreateAcademicTermRequest
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public DateOnly StartsOn { get; set; }
    [Required] public DateOnly EndsOn { get; set; }
}
```

**`UpdateAcademicTermRequest`** — same shape as Create.

**`AcademicTermResponse`**
```csharp
public class AcademicTermResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }
}
```

### 4.4 Batch DTOs

**`CreateBatchRequest`**
```csharp
public class CreateBatchRequest
{
    [Required] public Guid TermId { get; set; }
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Name { get; set; } = string.Empty;
}
```

**`UpdateBatchRequest`** — Code + Name only.

**`AssignStudentRequest`**
```csharp
public class AssignStudentRequest
{
    [Required] public Guid StudentId { get; set; }
}
```

**`SetBatchEnrollmentStatusRequest`**
```csharp
public class SetBatchEnrollmentStatusRequest
{
    [Required] public EnrollmentStatus Status { get; set; }
}
```

**`BatchResponse`**
```csharp
public class BatchResponse
{
    public Guid Id { get; set; }
    public Guid TermId { get; set; }
    public string TermCode { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
```

**`BatchStudentResponse`**
```csharp
public class BatchStudentResponse
{
    public Guid EnrollmentId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
```

### 4.5 Course DTOs

**`CreateCourseRequest`**
```csharp
public class CreateCourseRequest
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
```

**`UpdateCourseRequest`** — same shape.

**`CourseResponse`**
```csharp
public class CourseResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
```

### 4.6 CourseEnrollment DTOs

**`EnrollStudentsRequest`**
```csharp
public class EnrollStudentsRequest
{
    [Required] public Guid CourseId { get; set; }
    [Required, MinLength(1)] public List<Guid> BatchEnrollmentIds { get; set; } = [];
}
```

**`SetCourseEnrollmentStatusRequest`**
```csharp
public class SetCourseEnrollmentStatusRequest
{
    [Required] public EnrollmentStatus Status { get; set; }
}
```

**`CourseStudentResponse`**
```csharp
public class CourseStudentResponse
{
    public Guid EnrollmentId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string BatchCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
```

**`StudentCourseResponse`**
```csharp
public class StudentCourseResponse
{
    public Guid EnrollmentId { get; set; }
    public Guid CourseId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
```

### 4.7 TeacherCourseAllocation DTOs

**`AllocateTeacherRequest`**
```csharp
public class AllocateTeacherRequest
{
    [Required] public Guid TeacherId { get; set; }
    [Required] public Guid CourseId { get; set; }
}
```

**`SetAllocationStatusRequest`**
```csharp
public class SetAllocationStatusRequest
{
    [Required] public TeacherCourseAllocationStatus Status { get; set; }
}
```

**`CourseTeacherResponse`**
```csharp
public class CourseTeacherResponse
{
    public Guid AllocationId { get; set; }
    public Guid TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
```

**`TeacherCourseResponse`**
```csharp
public class TeacherCourseResponse
{
    public Guid AllocationId { get; set; }
    public Guid CourseId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
```

### 4.8 Assignment DTOs

**`CreateAssignmentRequest`**
```csharp
public class CreateAssignmentRequest
{
    [Required] public Guid CourseId { get; set; }
    [Required] public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required] public DateTime DeadlineAt { get; set; }
    [Required, Range(0.01, double.MaxValue)] public decimal MaximumMarks { get; set; }
    public bool AllowResubmission { get; set; }
}
```

**`UpdateAssignmentRequest`** — Title, Description, DeadlineAt, MaximumMarks, AllowResubmission.

**`AssignmentResponse`**
```csharp
public class AssignmentResponse
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DeadlineAt { get; set; }
    public decimal MaximumMarks { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool AllowResubmission { get; set; }
    public DateTime? SubmissionsClosedAt { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
}
```

### 4.9 Submission DTOs

**`UpsertSubmissionRequest`**
```csharp
public class UpsertSubmissionRequest
{
    public string? AnswerText { get; set; }
}
```

**`ReviewSubmissionRequest`**
```csharp
public class ReviewSubmissionRequest
{
    [Required, Range(0, double.MaxValue)] public decimal Marks { get; set; }
    public string? Feedback { get; set; }
    [Required] public SubmissionStatus Status { get; set; }
}
```

**`SubmissionResponse`**
```csharp
public class SubmissionResponse
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string? AnswerText { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public decimal? Marks { get; set; }
    public string? Feedback { get; set; }
    public List<AttachmentResponse> Attachments { get; set; } = [];
}
```

### 4.10 SubmissionAttachment DTOs

**`AttachmentResponse`**
```csharp
public class AttachmentResponse
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long ByteSize { get; set; }
}
```

---

## 5. DbContext & Entity Configurations

### 5.1 `DbContext/AppDbContext.cs`

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<AcademicTerm> AcademicTerms => Set<AcademicTerm>();
    public DbSet<AcademicBatch> AcademicBatches => Set<AcademicBatch>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<BatchEnrollment> BatchEnrollments => Set<BatchEnrollment>();
    public DbSet<CourseEnrollment> CourseEnrollments => Set<CourseEnrollment>();
    public DbSet<TeacherCourseAllocation> TeacherCourseAllocations => Set<TeacherCourseAllocation>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<SubmissionAttachment> SubmissionAttachments => Set<SubmissionAttachment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### 5.2 Entity Configurations (one file per entity in `DbContext/Configurations/`)

Each `IEntityTypeConfiguration<T>` file sets:

| Configuration File | Key Settings |
|---|---|
| `UserConfiguration` | Table `"users"`. Unique index on `Email`. `Roll` is an optional string column. `Role` is stored as string. `AuthVersion` defaults to `1`. |
| `AcademicTermConfiguration` | Table `"academic_terms"`. Unique index on `Code`. |
| `AcademicBatchConfiguration` | Table `"academic_batches"`. FK → `AcademicTerm`. |
| `CourseConfiguration` | Table `"courses"`. Unique index on `Code`. |
| `BatchEnrollmentConfiguration` | Table `"batch_enrollments"`. Unique composite index on `(StudentId, BatchId)`. FK → `User`, `AcademicBatch`. |
| `CourseEnrollmentConfiguration` | Table `"course_enrollments"`. Unique composite index on `(BatchEnrollmentId, CourseId)`. FK → `BatchEnrollment`, `Course`. |
| `TeacherCourseAllocationConfiguration` | Table `"teacher_course_allocations"`. Unique composite index on `(TeacherId, CourseId)`. FK → `User`, `Course`. |
| `AssignmentConfiguration` | Table `"assignments"`. Global query filter: `a => a.DeletedAt == null`. FK → `Course`, `User` (CreatedBy). `MaximumMarks` precision 8,2. `SubmissionsClosedAt` is nullable. |
| `SubmissionConfiguration` | Table `"submissions"`. Unique composite index on `(AssignmentId, StudentId)`. FK → `Assignment`, `User` (Student), `User` (EvaluatedBy). `Marks` precision 8,2. |
| `SubmissionAttachmentConfiguration` | Table `"submission_attachments"`. Column `FileData` type `bytea`. FK → `Submission`. |

---

## 6. Unit of Work

### 6.1 `UnitOfWork/IUnitOfWork.cs`

```csharp
public interface IUnitOfWork
{
    AppDbContext Context { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
```

### 6.2 `UnitOfWork/UnitOfWork.cs`

```csharp
public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    public AppDbContext Context => context;
    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => context.SaveChangesAsync(ct);
}
```

---

## 7. Service Interfaces & Implementations

Each service receives `IUnitOfWork` via constructor injection.

---

### 7.1 Auth — `Services/Auth/`

**`IAuthService`** (2 methods)

| Method | Signature | Description |
|---|---|---|
| `AuthenticateAsync` | `Task<User?> AuthenticateAsync(LoginRequest request)` | Finds user by email, verifies BCrypt hash, checks `IsActive`, and returns the authenticated user with its current `AuthVersion` for the JWT claim. |
| `GetCurrentUserAsync` | `Task<CurrentUserResponse?> GetCurrentUserAsync(Guid userId)` | Loads user by ID, maps to `CurrentUserResponse`. |

**`AuthService`** — implements `IAuthService`. Uses `IUnitOfWork` to query `Users`.

---

### 7.2 Users — `Services/Users/`

**`IUserService`** (6 methods)

| Method | Signature | Description |
|---|---|---|
| `GetUsersAsync` | `Task<List<UserResponse>> GetUsersAsync(UserRole? roleFilter)` | Lists all users, optional role filter. |
| `GetUserByIdAsync` | `Task<UserResponse?> GetUserByIdAsync(Guid id)` | Single user by ID. |
| `CreateUserAsync` | `Task<UserResponse> CreateUserAsync(CreateUserRequest request)` | Validates unique email, hashes password, creates user. |
| `UpdateUserAsync` | `Task<UserResponse?> UpdateUserAsync(Guid id, UpdateUserRequest request)` | Updates name/email. Validates unique email. |
| `SetUserActiveStatusAsync` | `Task<bool> SetUserActiveStatusAsync(Guid id, SetActiveStatusRequest request)` | Enables/disables user and increments `AuthVersion` so previously issued JWTs are rejected during token validation. |
| `ChangePasswordAsync` | `Task<bool> ChangePasswordAsync(Guid id, ChangePasswordRequest request)` | Admin resets a user's password and increments `AuthVersion` to invalidate previously issued JWTs. |

---

### 7.3 Academic Terms — `Services/AcademicTerms/`

**`IAcademicTermService`** (5 methods)

| Method | Signature | Description |
|---|---|---|
| `GetAcademicTermsAsync` | `Task<List<AcademicTermResponse>> GetAcademicTermsAsync()` | List all terms. |
| `GetAcademicTermByIdAsync` | `Task<AcademicTermResponse?> GetAcademicTermByIdAsync(Guid id)` | Single term by ID. |
| `CreateAcademicTermAsync` | `Task<AcademicTermResponse> CreateAcademicTermAsync(CreateAcademicTermRequest request)` | Validates unique code, date range. |
| `UpdateAcademicTermAsync` | `Task<AcademicTermResponse?> UpdateAcademicTermAsync(Guid id, UpdateAcademicTermRequest request)` | Updates term. |
| `DeleteAcademicTermAsync` | `Task<bool> DeleteAcademicTermAsync(Guid id)` | Hard delete. Rejects if batches reference the term. |

---

### 7.4 Batches — `Services/Batches/`

**`IBatchService`** (8 methods)

| Method | Signature | Description |
|---|---|---|
| `GetBatchesAsync` | `Task<List<BatchResponse>> GetBatchesAsync()` | List all batches with term info. |
| `GetBatchByIdAsync` | `Task<BatchResponse?> GetBatchByIdAsync(Guid id)` | Single batch. |
| `CreateBatchAsync` | `Task<BatchResponse> CreateBatchAsync(CreateBatchRequest request)` | Validates term exists. |
| `UpdateBatchAsync` | `Task<BatchResponse?> UpdateBatchAsync(Guid id, UpdateBatchRequest request)` | Updates code/name. |
| `DeleteBatchAsync` | `Task<bool> DeleteBatchAsync(Guid id)` | Hard delete. Rejects if enrollments exist. |
| `GetBatchStudentsAsync` | `Task<List<BatchStudentResponse>> GetBatchStudentsAsync(Guid batchId)` | Lists enrolled students. |
| `AssignStudentAsync` | `Task<BatchStudentResponse> AssignStudentAsync(Guid batchId, AssignStudentRequest request)` | Validates student role, uniqueness `(studentId, batchId)`, at most one active batch per term. |
| `SetBatchEnrollmentStatusAsync` | `Task<bool> SetBatchEnrollmentStatusAsync(Guid enrollmentId, SetBatchEnrollmentStatusRequest request)` | Activates/deactivates batch membership. |

---

### 7.5 Courses — `Services/Courses/`

**`ICourseService`** (5 methods)

| Method | Signature | Description |
|---|---|---|
| `GetCoursesAsync` | `Task<List<CourseResponse>> GetCoursesAsync()` | List all courses. |
| `GetCourseByIdAsync` | `Task<CourseResponse?> GetCourseByIdAsync(Guid id)` | Single course. |
| `CreateCourseAsync` | `Task<CourseResponse> CreateCourseAsync(CreateCourseRequest request)` | Validates unique code. |
| `UpdateCourseAsync` | `Task<CourseResponse?> UpdateCourseAsync(Guid id, UpdateCourseRequest request)` | Updates course. |
| `DeleteCourseAsync` | `Task<bool> DeleteCourseAsync(Guid id)` | Hard delete. Rejects if allocations, enrolments, or assignments exist. |

---

### 7.6 Course Enrollments — `Services/CourseEnrollments/`

**`ICourseEnrollmentService`** (4 methods)

| Method | Signature | Description |
|---|---|---|
| `GetCourseStudentsAsync` | `Task<List<CourseStudentResponse>> GetCourseStudentsAsync(Guid courseId)` | Lists students enrolled in a course. |
| `GetStudentCoursesAsync` | `Task<List<StudentCourseResponse>> GetStudentCoursesAsync(Guid studentId)` | Lists courses a student is enrolled in. |
| `EnrollStudentsAsync` | `Task<List<CourseStudentResponse>> EnrollStudentsAsync(EnrollStudentsRequest request)` | Accepts courseId + batch-enrollment IDs. Verifies each is Active. Creates `CourseEnrollment` records. Enforces uniqueness `(batchEnrollmentId, courseId)`. |
| `SetCourseEnrollmentStatusAsync` | `Task<bool> SetCourseEnrollmentStatusAsync(Guid enrollmentId, SetCourseEnrollmentStatusRequest request)` | Activates/deactivates. |

---

### 7.7 Teacher-Course Allocations — `Services/TeacherCourseAllocations/`

**`ITeacherCourseAllocationService`** (4 methods)

| Method | Signature | Description |
|---|---|---|
| `GetCourseTeachersAsync` | `Task<List<CourseTeacherResponse>> GetCourseTeachersAsync(Guid courseId)` | Lists teachers allocated to a course. |
| `GetTeacherCoursesAsync` | `Task<List<TeacherCourseResponse>> GetTeacherCoursesAsync(Guid teacherId)` | Lists courses allocated to a teacher. |
| `AllocateTeacherAsync` | `Task<CourseTeacherResponse> AllocateTeacherAsync(AllocateTeacherRequest request)` | Validates teacher role + course exists. Enforces uniqueness `(teacherId, courseId)`. |
| `SetTeacherCourseAllocationStatusAsync` | `Task<bool> SetTeacherCourseAllocationStatusAsync(Guid allocationId, SetAllocationStatusRequest request)` | Activates/deactivates. |

---

### 7.8 Assignments — `Services/Assignments/`

**`IAssignmentService`** (7 methods)

| Method | Signature | Description |
|---|---|---|
| `GetAssignmentsAsync` | `Task<List<AssignmentResponse>> GetAssignmentsAsync(Guid userId, UserRole role, Guid? courseIdFilter)` | **Admin**: all non-deleted. **Teacher**: only for their allocated courses. **Student**: published, non-deleted, for active course enrolments. |
| `GetAssignmentByIdAsync` | `Task<AssignmentResponse?> GetAssignmentByIdAsync(Guid id, Guid userId, UserRole role)` | Same role-aware scoping as above, single record. |
| `CreateAssignmentAsync` | `Task<AssignmentResponse> CreateAssignmentAsync(Guid teacherId, CreateAssignmentRequest request)` | Validates teacher has active allocation to the course. Creates as `Draft`. |
| `UpdateAssignmentAsync` | `Task<AssignmentResponse?> UpdateAssignmentAsync(Guid id, Guid teacherId, UpdateAssignmentRequest request)` | Only the owning teacher. Only Draft assignments may be edited, or Published with no submissions yet. |
| `PublishAssignmentAsync` | `Task<bool> PublishAssignmentAsync(Guid id, Guid teacherId)` | Sets status to `Published`. Only owning teacher. |
| `CloseSubmissionsAsync` | `Task<bool> CloseSubmissionsAsync(Guid id, Guid teacherId)` | Sets `SubmissionsClosedAt = DateTime.UtcNow`. Only owning teacher. Once closed, no student submission or attachment changes are allowed. |
| `DeleteAssignmentAsync` | `Task<bool> DeleteAssignmentAsync(Guid id, Guid teacherId)` | Soft delete: sets `DeletedAt = DateTime.UtcNow`. Only owning teacher. |

---

### 7.9 Submissions — `Services/Submissions/`

**`ISubmissionService`** (5 methods)

| Method | Signature | Description |
|---|---|---|
| `GetMySubmissionsAsync` | `Task<List<SubmissionResponse>> GetMySubmissionsAsync(Guid studentId)` | Lists all submissions by the authenticated student. |
| `GetAssignmentSubmissionsAsync` | `Task<List<SubmissionResponse>> GetAssignmentSubmissionsAsync(Guid assignmentId, Guid userId, UserRole role)` | **Teacher**: submissions for assignments in their allocated courses. **Admin**: all. |
| `GetSubmissionByIdAsync` | `Task<SubmissionResponse?> GetSubmissionByIdAsync(Guid id, Guid userId, UserRole role)` | Role-scoped single record. |
| `UpsertSubmissionAsync` | `Task<SubmissionResponse> UpsertSubmissionAsync(Guid assignmentId, Guid studentId, UpsertSubmissionRequest request)` | Creates an initial submission while submissions are open, even after the deadline. Existing submissions require `AllowResubmission = true`. Rejects all writes after `SubmissionsClosedAt` is set. Sets status to `Submitted` before the deadline or `Late` after it. |
| `ReviewSubmissionAsync` | `Task<SubmissionResponse?> ReviewSubmissionAsync(Guid id, Guid teacherId, ReviewSubmissionRequest request)` | Validates teacher allocation to the submission's course. Validates `Marks` ≤ `MaximumMarks`. Sets status to `Reviewed` or `Returned`. Records `EvaluatedByUserId`. |

---

### 7.10 Submission Attachments — `Services/SubmissionAttachments/`

**`ISubmissionAttachmentService`** (3 methods)

| Method | Signature | Description |
|---|---|---|
| `AddAttachmentAsync` | `Task<AttachmentResponse> AddAttachmentAsync(Guid submissionId, Guid studentId, IFormFile file)` | Validates: student owns submission, submissions are not closed, existing submissions allow resubmission, file type is allowed, and file size is within the configured maximum. Stores `bytea` in PostgreSQL. |
| `DownloadAttachmentAsync` | `Task<(byte[] Data, string ContentType, string FileName)?> DownloadAttachmentAsync(Guid attachmentId, Guid userId, UserRole role)` | Returns file bytes. Scoped: student owns it, teacher allocated to course, or admin. |
| `DeleteAttachmentAsync` | `Task<bool> DeleteAttachmentAsync(Guid attachmentId, Guid studentId)` | Only the submitting student, while submissions are open and the existing submission allows resubmission. |

---

## 8. Controllers — Routes & Actions

Each feature controller lives in its own folder with an interface and implementation—for example, `Controllers/Batches/IBatchController.cs` and `Controllers/Batches/BatchesController.cs`. All implementations inherit `ControllerBase`, implement their feature interface, and use `[ApiController]` + `[Route("api/[controller]")]`.

---

### 8.1 `AuthController` — `api/auth`

| Action | HTTP Method | Route | Auth | Request Body | Response |
|---|---|---|---|---|---|
| `Login` | `POST` | `api/auth/login` | Anonymous | `LoginRequest` | `200 OK` + `AuthenticationResponse` (JWT access token) or `401` |
| `Logout` | `POST` | `api/auth/logout` | Authenticated | — | `204 No Content` (client discards JWT) |
| `Me` | `GET` | `api/auth/me` | Authenticated | — | `200 OK` + `CurrentUserResponse` |

**Implementation Notes**:
- `Login` calls `IAuthService.AuthenticateAsync`. On success, it creates a signed, short-lived JWT with `ClaimTypes.NameIdentifier` (userId), `ClaimTypes.Email`, `ClaimTypes.Role`, and `AuthVersion`; it returns the token and expiration in `AuthenticationResponse`.
- `Logout` returns `204 No Content`; the client discards its access token. No service method is needed because bearer access tokens are stateless.
- `Me` reads userId from claims, calls `IAuthService.GetCurrentUserAsync`.

---

### 8.2 `UsersController` — `api/users`

**Authorization**: `[Authorize(Roles = "Admin")]` on the entire controller.

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetAll` | `GET` | `api/users?role={role?}` | Query: `role` (optional) | `200` + `List<UserResponse>` |
| `GetById` | `GET` | `api/users/{id}` | Route: `id` | `200` + `UserResponse` or `404` |
| `Create` | `POST` | `api/users` | `CreateUserRequest` | `201 Created` + `UserResponse` |
| `Update` | `PUT` | `api/users/{id}` | `UpdateUserRequest` | `200` + `UserResponse` or `404` |
| `SetActiveStatus` | `PATCH` | `api/users/{id}/active-status` | `SetActiveStatusRequest` | `204` or `404` |
| `ChangePassword` | `PATCH` | `api/users/{id}/password` | `ChangePasswordRequest` | `204` or `404` |

---

### 8.3 `AcademicTermsController` — `api/academic-terms`

**Authorization**: `[Authorize(Roles = "Admin")]`

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetAll` | `GET` | `api/academic-terms` | — | `200` + `List<AcademicTermResponse>` |
| `GetById` | `GET` | `api/academic-terms/{id}` | Route: `id` | `200` + `AcademicTermResponse` or `404` |
| `Create` | `POST` | `api/academic-terms` | `CreateAcademicTermRequest` | `201 Created` + `AcademicTermResponse` |
| `Update` | `PUT` | `api/academic-terms/{id}` | `UpdateAcademicTermRequest` | `200` + `AcademicTermResponse` or `404` |
| `Delete` | `DELETE` | `api/academic-terms/{id}` | Route: `id` | `204` or `409 Conflict` (batches exist) or `404` |

---

### 8.4 `BatchesController` — `api/batches`

**Authorization**: `[Authorize(Roles = "Admin")]`

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetAll` | `GET` | `api/batches` | — | `200` + `List<BatchResponse>` |
| `GetById` | `GET` | `api/batches/{id}` | Route: `id` | `200` + `BatchResponse` or `404` |
| `Create` | `POST` | `api/batches` | `CreateBatchRequest` | `201` + `BatchResponse` |
| `Update` | `PUT` | `api/batches/{id}` | `UpdateBatchRequest` | `200` + `BatchResponse` or `404` |
| `Delete` | `DELETE` | `api/batches/{id}` | Route: `id` | `204` or `409` or `404` |
| `GetStudents` | `GET` | `api/batches/{id}/students` | Route: `id` | `200` + `List<BatchStudentResponse>` |
| `AssignStudent` | `POST` | `api/batches/{id}/students` | `AssignStudentRequest` | `201` + `BatchStudentResponse` |
| `SetStudentEnrollmentStatus` | `PATCH` | `api/batches/{id}/enrollments/{enrollmentId}/status` | `SetBatchEnrollmentStatusRequest` | `204` or `404` |

---

### 8.5 `CoursesController` — `api/courses`

**Authorization**: `[Authorize(Roles = "Admin")]`

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetAll` | `GET` | `api/courses` | — | `200` + `List<CourseResponse>` |
| `GetById` | `GET` | `api/courses/{id}` | Route: `id` | `200` + `CourseResponse` or `404` |
| `Create` | `POST` | `api/courses` | `CreateCourseRequest` | `201` + `CourseResponse` |
| `Update` | `PUT` | `api/courses/{id}` | `UpdateCourseRequest` | `200` + `CourseResponse` or `404` |
| `Delete` | `DELETE` | `api/courses/{id}` | Route: `id` | `204` or `409` or `404` |

---

### 8.6 `CourseEnrollmentsController` — `api/course-enrollments`

**Authorization**: `[Authorize(Roles = "Admin")]`

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetCourseStudents` | `GET` | `api/course-enrollments/courses/{courseId}/students` | Route: `courseId` | `200` + `List<CourseStudentResponse>` |
| `GetStudentCourses` | `GET` | `api/course-enrollments/students/{studentId}/courses` | Route: `studentId` | `200` + `List<StudentCourseResponse>` |
| `EnrollStudents` | `POST` | `api/course-enrollments` | `EnrollStudentsRequest` | `201` + `List<CourseStudentResponse>` |
| `SetStatus` | `PATCH` | `api/course-enrollments/{enrollmentId}/status` | `SetCourseEnrollmentStatusRequest` | `204` or `404` |

---

### 8.7 `TeacherCourseAllocationsController` — `api/teacher-allocations`

**Authorization**: `[Authorize(Roles = "Admin")]`

| Action | HTTP Method | Route | Request Body / Params | Response |
|---|---|---|---|---|
| `GetCourseTeachers` | `GET` | `api/teacher-allocations/courses/{courseId}/teachers` | Route: `courseId` | `200` + `List<CourseTeacherResponse>` |
| `GetTeacherCourses` | `GET` | `api/teacher-allocations/teachers/{teacherId}/courses` | Route: `teacherId` | `200` + `List<TeacherCourseResponse>` |
| `AllocateTeacher` | `POST` | `api/teacher-allocations` | `AllocateTeacherRequest` | `201` + `CourseTeacherResponse` |
| `SetStatus` | `PATCH` | `api/teacher-allocations/{allocationId}/status` | `SetAllocationStatusRequest` | `204` or `404` |

---

### 8.8 `AssignmentsController` — `api/assignments`

**Authorization**: Mixed — `[Authorize]` on controller; role-specific checks inside each action.

| Action | HTTP Method | Route | Auth Rule | Request Body / Params | Response |
|---|---|---|---|---|---|
| `GetAll` | `GET` | `api/assignments?courseId={courseId?}` | Authenticated (role-filtered in service) | Query: `courseId` (optional) | `200` + `List<AssignmentResponse>` |
| `GetById` | `GET` | `api/assignments/{id}` | Authenticated (role-scoped) | Route: `id` | `200` + `AssignmentResponse` or `404`/`403` |
| `Create` | `POST` | `api/assignments` | Teacher only | `CreateAssignmentRequest` | `201` + `AssignmentResponse` or `403` |
| `Update` | `PUT` | `api/assignments/{id}` | Owning Teacher only | `UpdateAssignmentRequest` | `200` + `AssignmentResponse` or `403`/`404` |
| `Publish` | `PATCH` | `api/assignments/{id}/publish` | Owning Teacher only | — | `204` or `403`/`404` |
| `Delete` | `DELETE` | `api/assignments/{id}` | Owning Teacher only | — | `204` (soft delete) or `403`/`404` |

---

### 8.9 `SubmissionsController` — `api/submissions`

**Authorization**: `[Authorize]` on controller; role checks per action.

| Action | HTTP Method | Route | Auth Rule | Request Body / Params | Response |
|---|---|---|---|---|---|
| `GetMine` | `GET` | `api/submissions/mine` | Student only | — | `200` + `List<SubmissionResponse>` |
| `GetForAssignment` | `GET` | `api/submissions/assignments/{assignmentId}` | Teacher (allocated) / Admin | Route: `assignmentId` | `200` + `List<SubmissionResponse>` |
| `GetById` | `GET` | `api/submissions/{id}` | Role-scoped | Route: `id` | `200` + `SubmissionResponse` or `403`/`404` |
| `SubmitOrUpdate` | `POST` | `api/submissions/assignments/{assignmentId}` | Student only | `UpsertSubmissionRequest` | `200`/`201` + `SubmissionResponse` |
| `Review` | `PATCH` | `api/submissions/{id}/review` | Teacher (allocated) | `ReviewSubmissionRequest` | `200` + `SubmissionResponse` or `403`/`404` |

---

### 8.10 `SubmissionAttachmentsController` — `api/submission-attachments`

**Authorization**: `[Authorize]` on controller; role checks per action.

| Action | HTTP Method | Route | Auth Rule | Request Body / Params | Response |
|---|---|---|---|---|---|
| `Upload` | `POST` | `api/submission-attachments/submissions/{submissionId}` | Student (owner) | `IFormFile` (multipart) | `201` + `AttachmentResponse` |
| `Download` | `GET` | `api/submission-attachments/{attachmentId}` | Role-scoped | Route: `attachmentId` | `200` + `FileContentResult` |
| `Delete` | `DELETE` | `api/submission-attachments/{attachmentId}` | Student (owner, before deadline) | Route: `attachmentId` | `204` or `403`/`404` |

---

## 9. Middleware

### 9.1 `Middleware/GlobalExceptionMiddleware.cs`

- Catches unhandled exceptions.
- Logs with `ILogger<GlobalExceptionMiddleware>`.
- Returns RFC 7807 `ProblemDetails` JSON:
  - `InvalidOperationException` → `400 Bad Request`
  - `UnauthorizedAccessException` → `403 Forbidden`
  - `KeyNotFoundException` → `404 Not Found`
  - All others → `500 Internal Server Error` (generic message, no stack trace in production).

---

## 10. Helpers

### 10.1 `Helpers/ClaimsPrincipalExtensions.cs`

```csharp
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
        => Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static UserRole GetUserRole(this ClaimsPrincipal principal)
        => Enum.Parse<UserRole>(principal.FindFirstValue(ClaimTypes.Role)!);
}
```

---

## 11. `Program.cs` — Full DI & Pipeline Configuration

The revised `Program.cs` must configure:

1. **DbContext** — `AddDbContext<AppDbContext>` with `UseNpgsql(connectionString)`.
2. **JWT Bearer Authentication** — configure `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` to validate the signing key, issuer, audience, lifetime, and the `AuthVersion` claim against the active user record. Return `401` for missing, expired, or invalid tokens and `403` for authenticated users without the required role.
3. **Authorization** — `AddAuthorizationBuilder()`.
4. **Controllers** — `AddControllers()` with JSON serialization options (`JsonStringEnumConverter`, `CamelCase`).
5. **Swagger** — `AddSwaggerGen()`.
6. **Unit of Work** — `AddScoped<IUnitOfWork, UnitOfWork>()`.
7. **Feature Services** — 10 `AddScoped<IXxxService, XxxService>()` registrations.
8. **CORS** — Allow the Next.js frontend origin (`http://localhost:3000`) and its `Authorization` header. Credentials are not required because authentication uses bearer tokens rather than cookies.
9. **Middleware pipeline** order:
   - `UseSwagger()` + `UseSwaggerUI()` (dev)
   - `UseCors()`
   - `UseAuthentication()`
   - `UseAuthorization()`
   - `UseMiddleware<GlobalExceptionMiddleware>()`
   - `MapControllers()`
10. **Seed data** — Call `SeedData.InitializeAsync(scope.ServiceProvider)` on startup.

---

## 12. Configuration — `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=onnorokom_asm;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Issuer": "OnnoRokomBackend",
    "Audience": "OnnoRokomFrontend",
    "SigningKey": "replace-with-a-long-random-secret-from-user-secrets-or-environment",
    "AccessTokenLifetimeMinutes": 60
  },
  "FileUpload": {
    "MaxFileSizeBytes": 10485760,
    "AllowedContentTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## 13. Seed Data — `Seed/SeedData.cs`

**Method**: `public static async Task InitializeAsync(IServiceProvider serviceProvider)`

Seeds the following demo accounts (BCrypt-hashed passwords):

| Role | Email | Password | Full Name |
|---|---|---|---|
| Admin | `admin@onnorokom.com` | `Admin@123` | System Admin |
| Teacher | `teacher@onnorokom.com` | `Teacher@123` | Demo Teacher |
| Student | `student@onnorokom.com` | `Student@123` | Demo Student |

Also seeds:
- 1 Academic Term (e.g., "Fall 2026")
- 2 Academic Batches
- 3 Courses
- Batch enrollments for the demo student
- Course enrollments
- Teacher allocation to courses
- 2 sample assignments (1 Draft, 1 Published)
- 1 sample submission

**Guard**: Skip seeding if `Users` table already has data.

---

## 14. EF Core Migrations

Run after all entity configurations are complete:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 15. Verification Plan

### 15.1 Build & Run

```bash
cd Backend/OnnorokomBackend
dotnet build
dotnet run
```

- Verify Swagger UI at `https://localhost:{port}/swagger`.
- Verify seed data creates demo accounts.

### 15.2 Manual API Testing (via Swagger)

- Login with each role → verify a JWT access token is returned.
- Call protected endpoints with a valid bearer token → verify the role is read from JWT claims.
- Call protected endpoints with an expired, malformed, or invalidated token → verify `401`.
- Hit protected endpoints with wrong role → verify `403`.
- Hit protected endpoints without auth → verify `401`.
- CRUD each resource and verify responses.
- Submit an assignment as a student → verify Late/Submitted status.
- Upload/download attachments.

### 15.3 Unit Tests (Separate Test Project — Future)

- Test each service method in isolation using in-memory or mocked `AppDbContext`.
- Verify all business rules listed in PLAN.md § Test Plan.

---

## 16. Summary Counts

| Category | Count |
|---|---|
| Entities | 10 |
| Enums | 5 |
| DTOs (Request + Response) | ~30 |
| EF Configurations | 10 |
| Service Interfaces | 10 |
| Service Implementations | 10 |
| Service Methods (total) | 48 |
| Controllers | 10 |
| Controller Actions (total) | 49 |
| API Routes (total) | 49 |
| Middleware | 1 |
| Helper classes | 1 |

---

## 17. Implementation Order

| Phase | What to build | Files |
|---|---|---|
| **1. Foundation** | Enums, Entities, AppDbContext, EF Configurations, Initial Migration | `Models/Enums/*`, `Models/Entities/*`, `DbContext/*`, `Migrations/*` |
| **2. Infrastructure** | UnitOfWork, GlobalExceptionMiddleware, ClaimsPrincipalExtensions, Program.cs wiring | `UnitOfWork/*`, `Middleware/*`, `Helpers/*`, `Program.cs` |
| **3. Auth** | AuthService, AuthController, JWT setup, SeedData | `Services/Auth/*`, `Controllers/Auth/*`, `Seed/*` |
| **4. Admin CRUD** | Users, AcademicTerms, Batches, Courses + their DTOs, Services, Controllers | `Models/DTOs/Users/*`, `Services/Users/*`, `Controllers/Users/*`, etc. |
| **5. Enrollment & Allocation** | CourseEnrollments, TeacherCourseAllocations + DTOs, Services, Controllers | `Models/DTOs/CourseEnrollments/*`, `Services/CourseEnrollments/*`, etc. |
| **6. Assignments** | Assignment DTOs, Service, Controller | `Models/DTOs/Assignments/*`, `Services/Assignments/*`, `Controllers/AssignmentsController.cs` |
| **7. Submissions** | Submission DTOs, Service, Controller | `Models/DTOs/Submissions/*`, `Services/Submissions/*`, `Controllers/SubmissionsController.cs` |
| **8. Attachments** | Attachment DTOs, Service, Controller, file-upload config | `Models/DTOs/SubmissionAttachments/*`, `Services/SubmissionAttachments/*`, `Controllers/SubmissionAttachmentsController.cs` |
| **9. Polish** | Swagger annotations, CORS tuning, logging, `.env.example` | Various |
| **10. Test** | xUnit test project, service unit tests | `Tests/*` |
