using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.Assignments;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Assignments;

public class AssignmentService(IUnitOfWork unitOfWork) : IAssignmentService
{
    public async Task<List<AssignmentResponse>> GetAssignmentsAsync(Guid userId, UserRole role, Guid? courseIdFilter, CancellationToken ct = default)
    {
        var query = unitOfWork.Context.Assignments
            .AsNoTracking()
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .AsQueryable();

        if (courseIdFilter.HasValue)
        {
            query = query.Where(a => a.CourseId == courseIdFilter.Value);
        }

        if (role == UserRole.Teacher)
        {
            var allocatedCourseIds = await unitOfWork.Context.TeacherCourseAllocations
                .Where(tca => tca.TeacherId == userId && tca.Status == TeacherCourseAllocationStatus.Active)
                .Select(tca => tca.CourseId)
                .ToListAsync(ct);

            query = query.Where(a => allocatedCourseIds.Contains(a.CourseId));
        }
        else if (role == UserRole.Student)
        {
            var enrolledCourseIds = await unitOfWork.Context.CourseEnrollments
                .Where(ce => ce.BatchEnrollment.StudentId == userId
                             && ce.Status == EnrollmentStatus.Active
                             && ce.BatchEnrollment.Status == EnrollmentStatus.Active)
                .Select(ce => ce.CourseId)
                .ToListAsync(ct);

            query = query.Where(a => a.Status == AssignmentStatus.Published && enrolledCourseIds.Contains(a.CourseId));
        }

        return await query
            .OrderByDescending(a => a.DeadlineAt)
            .Select(a => new AssignmentResponse
            {
                Id = a.Id,
                CourseId = a.CourseId,
                CourseCode = a.Course.Code,
                CourseTitle = a.Course.Title,
                Title = a.Title,
                Description = a.Description,
                DeadlineAt = a.DeadlineAt,
                MaximumMarks = a.MaximumMarks,
                Status = a.Status.ToString(),
                AllowResubmission = a.AllowResubmission,
                SubmissionsClosedAt = a.SubmissionsClosedAt,
                CreatedByUserId = a.CreatedByUserId,
                CreatedByName = a.CreatedBy.FullName
            })
            .ToListAsync(ct);
    }

    public async Task<AssignmentResponse?> GetAssignmentByIdAsync(Guid id, Guid userId, UserRole role, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.Context.Assignments
            .AsNoTracking()
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        if (assignment is null)
        {
            return null;
        }

        if (role == UserRole.Teacher)
        {
            var isAllocated = await unitOfWork.Context.TeacherCourseAllocations
                .AnyAsync(tca => tca.TeacherId == userId && tca.CourseId == assignment.CourseId && tca.Status == TeacherCourseAllocationStatus.Active, ct);

            if (!isAllocated)
            {
                throw new UnauthorizedAccessException("You are not allocated to the course for this assignment.");
            }
        }
        else if (role == UserRole.Student)
        {
            if (assignment.Status != AssignmentStatus.Published)
            {
                return null;
            }

            var isEnrolled = await unitOfWork.Context.CourseEnrollments
                .AnyAsync(ce => ce.CourseId == assignment.CourseId
                                && ce.BatchEnrollment.StudentId == userId
                                && ce.Status == EnrollmentStatus.Active
                                && ce.BatchEnrollment.Status == EnrollmentStatus.Active, ct);

            if (!isEnrolled)
            {
                throw new UnauthorizedAccessException("You are not enrolled in the course for this assignment.");
            }
        }

        return new AssignmentResponse
        {
            Id = assignment.Id,
            CourseId = assignment.CourseId,
            CourseCode = assignment.Course.Code,
            CourseTitle = assignment.Course.Title,
            Title = assignment.Title,
            Description = assignment.Description,
            DeadlineAt = assignment.DeadlineAt,
            MaximumMarks = assignment.MaximumMarks,
            Status = assignment.Status.ToString(),
            AllowResubmission = assignment.AllowResubmission,
            SubmissionsClosedAt = assignment.SubmissionsClosedAt,
            CreatedByUserId = assignment.CreatedByUserId,
            CreatedByName = assignment.CreatedBy.FullName
        };
    }

    public async Task<AssignmentResponse> CreateAssignmentAsync(Guid teacherId, CreateAssignmentRequest request, CancellationToken ct = default)
    {
        var isAllocated = await unitOfWork.Context.TeacherCourseAllocations
            .AnyAsync(tca => tca.TeacherId == teacherId && tca.CourseId == request.CourseId && tca.Status == TeacherCourseAllocationStatus.Active, ct);

        if (!isAllocated)
        {
            throw new UnauthorizedAccessException("Teacher does not have an active allocation to this course.");
        }

        var course = await unitOfWork.Context.Courses
            .SingleOrDefaultAsync(c => c.Id == request.CourseId, ct);

        if (course is null)
        {
            throw new InvalidOperationException($"Course with ID '{request.CourseId}' does not exist.");
        }

        var teacher = await unitOfWork.Context.Users
            .SingleOrDefaultAsync(u => u.Id == teacherId, ct);

        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            CourseId = request.CourseId,
            CreatedByUserId = teacherId,
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            DeadlineAt = request.DeadlineAt.ToUniversalTime(),
            MaximumMarks = request.MaximumMarks,
            Status = AssignmentStatus.Draft,
            AllowResubmission = request.AllowResubmission
        };

        unitOfWork.Context.Assignments.Add(assignment);
        await unitOfWork.SaveChangesAsync(ct);

        return new AssignmentResponse
        {
            Id = assignment.Id,
            CourseId = assignment.CourseId,
            CourseCode = course.Code,
            CourseTitle = course.Title,
            Title = assignment.Title,
            Description = assignment.Description,
            DeadlineAt = assignment.DeadlineAt,
            MaximumMarks = assignment.MaximumMarks,
            Status = assignment.Status.ToString(),
            AllowResubmission = assignment.AllowResubmission,
            SubmissionsClosedAt = null,
            CreatedByUserId = teacherId,
            CreatedByName = teacher?.FullName ?? string.Empty
        };
    }

    public async Task<AssignmentResponse?> UpdateAssignmentAsync(Guid id, Guid teacherId, UpdateAssignmentRequest request, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.Context.Assignments
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        if (assignment is null)
        {
            return null;
        }

        if (assignment.CreatedByUserId != teacherId)
        {
            throw new UnauthorizedAccessException("Only the teacher who created this assignment can modify it.");
        }

        if (assignment.Status == AssignmentStatus.Published)
        {
            var hasSubmissions = await unitOfWork.Context.Submissions
                .AnyAsync(s => s.AssignmentId == id, ct);

            if (hasSubmissions)
            {
                throw new InvalidOperationException("Cannot modify assignment details because student submissions already exist.");
            }
        }

        assignment.Title = request.Title.Trim();
        assignment.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        assignment.DeadlineAt = request.DeadlineAt.ToUniversalTime();
        assignment.MaximumMarks = request.MaximumMarks;
        assignment.AllowResubmission = request.AllowResubmission;

        await unitOfWork.SaveChangesAsync(ct);

        return new AssignmentResponse
        {
            Id = assignment.Id,
            CourseId = assignment.CourseId,
            CourseCode = assignment.Course.Code,
            CourseTitle = assignment.Course.Title,
            Title = assignment.Title,
            Description = assignment.Description,
            DeadlineAt = assignment.DeadlineAt,
            MaximumMarks = assignment.MaximumMarks,
            Status = assignment.Status.ToString(),
            AllowResubmission = assignment.AllowResubmission,
            SubmissionsClosedAt = assignment.SubmissionsClosedAt,
            CreatedByUserId = assignment.CreatedByUserId,
            CreatedByName = assignment.CreatedBy.FullName
        };
    }

    public async Task<bool> PublishAssignmentAsync(Guid id, Guid teacherId, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.Context.Assignments
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        if (assignment is null)
        {
            return false;
        }

        if (assignment.CreatedByUserId != teacherId)
        {
            throw new UnauthorizedAccessException("Only the teacher who created this assignment can publish it.");
        }

        assignment.Status = AssignmentStatus.Published;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CloseSubmissionsAsync(Guid id, Guid teacherId, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.Context.Assignments
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        if (assignment is null)
        {
            return false;
        }

        if (assignment.CreatedByUserId != teacherId)
        {
            throw new UnauthorizedAccessException("Only the teacher who created this assignment can close submissions.");
        }

        assignment.SubmissionsClosedAt = DateTime.UtcNow;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAssignmentAsync(Guid id, Guid teacherId, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.Context.Assignments
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        if (assignment is null)
        {
            return false;
        }

        if (assignment.CreatedByUserId != teacherId)
        {
            throw new UnauthorizedAccessException("Only the teacher who created this assignment can delete it.");
        }

        assignment.DeletedAt = DateTime.UtcNow;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
