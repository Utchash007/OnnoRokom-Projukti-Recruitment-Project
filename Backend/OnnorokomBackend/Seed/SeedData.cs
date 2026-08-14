using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.DbContext;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Seed;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (await context.Users.AnyAsync())
        {
            return;
        }

        // 1. Users
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "System Admin",
            Email = "admin@onnorokom.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            IsActive = true,
            AuthVersion = 1
        };

        var teacherUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Demo Teacher",
            Email = "teacher@onnorokom.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
            Role = UserRole.Teacher,
            IsActive = true,
            AuthVersion = 1
        };

        var studentUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Demo Student",
            Email = "student@onnorokom.com",
            Roll = "S-1001",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
            Role = UserRole.Student,
            IsActive = true,
            AuthVersion = 1
        };

        context.Users.AddRange(adminUser, teacherUser, studentUser);

        // 2. Academic Term
        var term = new AcademicTerm
        {
            Id = Guid.NewGuid(),
            Code = "FALL2026",
            StartsOn = new DateOnly(2026, 9, 1),
            EndsOn = new DateOnly(2026, 12, 31)
        };
        context.AcademicTerms.Add(term);

        // 3. Batches
        var batchA = new AcademicBatch
        {
            Id = Guid.NewGuid(),
            TermId = term.Id,
            Code = "BATCH-2026-A",
            Name = "Batch 2026 Section A"
        };

        var batchB = new AcademicBatch
        {
            Id = Guid.NewGuid(),
            TermId = term.Id,
            Code = "BATCH-2026-B",
            Name = "Batch 2026 Section B"
        };
        context.AcademicBatches.AddRange(batchA, batchB);

        // 4. Courses
        var course1 = new Course
        {
            Id = Guid.NewGuid(),
            Code = "CSE101",
            Title = "Introduction to Programming",
            Description = "Basics of programming with C# and .NET"
        };

        var course2 = new Course
        {
            Id = Guid.NewGuid(),
            Code = "CSE102",
            Title = "Data Structures & Algorithms",
            Description = "Arrays, linked lists, trees, and algorithmic complexity"
        };

        var course3 = new Course
        {
            Id = Guid.NewGuid(),
            Code = "CSE103",
            Title = "Database Management Systems",
            Description = "Relational schema design, SQL, and indexing"
        };
        context.Courses.AddRange(course1, course2, course3);

        // 5. Batch Enrollment
        var batchEnrollment = new BatchEnrollment
        {
            Id = Guid.NewGuid(),
            BatchId = batchA.Id,
            StudentId = studentUser.Id,
            Status = EnrollmentStatus.Active
        };
        context.BatchEnrollments.Add(batchEnrollment);

        // 6. Course Enrollments
        var courseEnrollment1 = new CourseEnrollment
        {
            Id = Guid.NewGuid(),
            BatchEnrollmentId = batchEnrollment.Id,
            CourseId = course1.Id,
            Status = EnrollmentStatus.Active
        };

        var courseEnrollment2 = new CourseEnrollment
        {
            Id = Guid.NewGuid(),
            BatchEnrollmentId = batchEnrollment.Id,
            CourseId = course2.Id,
            Status = EnrollmentStatus.Active
        };
        context.CourseEnrollments.AddRange(courseEnrollment1, courseEnrollment2);

        // 7. Teacher Allocations
        var allocation1 = new TeacherCourseAllocation
        {
            Id = Guid.NewGuid(),
            TeacherId = teacherUser.Id,
            CourseId = course1.Id,
            Status = TeacherCourseAllocationStatus.Active
        };

        var allocation2 = new TeacherCourseAllocation
        {
            Id = Guid.NewGuid(),
            TeacherId = teacherUser.Id,
            CourseId = course2.Id,
            Status = TeacherCourseAllocationStatus.Active
        };
        context.TeacherCourseAllocations.AddRange(allocation1, allocation2);

        // 8. Assignments
        var assignment1 = new Assignment
        {
            Id = Guid.NewGuid(),
            CourseId = course1.Id,
            CreatedByUserId = teacherUser.Id,
            Title = "Assignment 1: Variables and Control Flow",
            Description = "Implement basic control flow patterns and submit your solution.",
            DeadlineAt = DateTime.UtcNow.AddDays(7),
            MaximumMarks = 100,
            Status = AssignmentStatus.Published,
            AllowResubmission = true
        };

        var assignment2 = new Assignment
        {
            Id = Guid.NewGuid(),
            CourseId = course2.Id,
            CreatedByUserId = teacherUser.Id,
            Title = "Assignment 2: Linked List Reversal (Draft)",
            Description = "Draft assignment for linked lists.",
            DeadlineAt = DateTime.UtcNow.AddDays(14),
            MaximumMarks = 50,
            Status = AssignmentStatus.Draft,
            AllowResubmission = false
        };
        context.Assignments.AddRange(assignment1, assignment2);

        // 9. Sample Submission
        var submission1 = new Submission
        {
            Id = Guid.NewGuid(),
            AssignmentId = assignment1.Id,
            StudentId = studentUser.Id,
            AnswerText = "Here is my completed assignment for Variables and Control Flow.",
            Status = SubmissionStatus.Submitted,
            SubmittedAt = DateTime.UtcNow
        };
        context.Submissions.Add(submission1);

        await context.SaveChangesAsync();
    }
}
