using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.SubmissionAttachments;
using OnnoRokomBackend.Models.DTOs.Submissions;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Submissions;

public class SubmissionService(IUnitOfWork unitOfWork) : ISubmissionService
{
    public async Task<List<SubmissionResponse>> GetMySubmissionsAsync(Guid studentId, CancellationToken ct = default)
    {
        return await unitOfWork.SubmissionRepo.GetAll()
            .AsNoTracking()
            .Where(s => s.StudentId == studentId)
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .Include(s => s.EvaluatedBy)
            .Include(s => s.Attachments)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => MapToResponse(s))
            .ToListAsync(ct);
    }

    public async Task<List<SubmissionResponse>> GetAssignmentSubmissionsAsync(Guid assignmentId, Guid userId, UserRole role, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.AssignmentRepo.GetAll()
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Id == assignmentId, ct);

        if (assignment is null)
        {
            throw new InvalidOperationException($"Assignment with ID '{assignmentId}' was not found.");
        }

        if (role == UserRole.Teacher)
        {
            var isAllocated = await unitOfWork.TeacherCourseAllocationRepo.GetAll()
                .AnyAsync(tca => tca.TeacherId == userId && tca.CourseId == assignment.CourseId && tca.Status == TeacherCourseAllocationStatus.Active, ct);

            if (!isAllocated)
            {
                throw new UnauthorizedAccessException("You are not allocated to the course for this assignment.");
            }
        }
        else if (role != UserRole.Admin)
        {
            throw new UnauthorizedAccessException("You are not authorized to view all submissions for this assignment.");
        }

        return await unitOfWork.SubmissionRepo.GetAll()
            .AsNoTracking()
            .Where(s => s.AssignmentId == assignmentId)
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .Include(s => s.EvaluatedBy)
            .Include(s => s.Attachments)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => MapToResponse(s))
            .ToListAsync(ct);
    }

    public async Task<SubmissionResponse?> GetSubmissionByIdAsync(Guid id, Guid userId, UserRole role, CancellationToken ct = default)
    {
        var submission = await unitOfWork.SubmissionRepo.GetAll()
            .AsNoTracking()
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .Include(s => s.EvaluatedBy)
            .Include(s => s.Attachments)
            .SingleOrDefaultAsync(s => s.Id == id, ct);

        if (submission is null)
        {
            return null;
        }

        if (role == UserRole.Student)
        {
            if (submission.StudentId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to access this submission.");
            }
        }
        else if (role == UserRole.Teacher)
        {
            var isAllocated = await unitOfWork.TeacherCourseAllocationRepo.GetAll()
                .AnyAsync(tca => tca.TeacherId == userId && tca.CourseId == submission.Assignment.CourseId && tca.Status == TeacherCourseAllocationStatus.Active, ct);

            if (!isAllocated)
            {
                throw new UnauthorizedAccessException("You are not allocated to the course for this submission.");
            }
        }

        return MapToResponse(submission);
    }

    public async Task<SubmissionResponse> UpsertSubmissionAsync(Guid assignmentId, Guid studentId, UpsertSubmissionRequest request, CancellationToken ct = default)
    {
        var assignment = await unitOfWork.AssignmentRepo.GetAll()
            .Include(a => a.Course)
            .SingleOrDefaultAsync(a => a.Id == assignmentId, ct);

        if (assignment is null || assignment.Status != AssignmentStatus.Published)
        {
            throw new InvalidOperationException("Assignment is not available for submissions.");
        }

        var isEnrolled = await unitOfWork.CourseEnrollmentRepo.GetAll()
            .AnyAsync(ce => ce.CourseId == assignment.CourseId
                            && ce.BatchEnrollment.StudentId == studentId
                            && ce.Status == EnrollmentStatus.Active
                            && ce.BatchEnrollment.Status == EnrollmentStatus.Active, ct);

        if (!isEnrolled)
        {
            throw new UnauthorizedAccessException("You are not enrolled in the course for this assignment.");
        }

        if (assignment.SubmissionsClosedAt.HasValue)
        {
            throw new InvalidOperationException("Submissions for this assignment have been closed by the teacher.");
        }

        var existingSubmission = await unitOfWork.SubmissionRepo.GetAll()
            .Include(s => s.Attachments)
            .SingleOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId, ct);

        var isLate = DateTime.UtcNow > assignment.DeadlineAt;

        if (existingSubmission is not null)
        {
            if (!assignment.AllowResubmission)
            {
                throw new InvalidOperationException("Resubmission is not permitted for this assignment.");
            }

            existingSubmission.AnswerText = request.AnswerText;
            existingSubmission.SubmittedAt = DateTime.UtcNow;
            existingSubmission.Status = isLate ? SubmissionStatus.Late : SubmissionStatus.Submitted;

            await unitOfWork.SaveChangesAsync(ct);

            var student = await unitOfWork.UserRepo.GetAll().AsNoTracking().SingleAsync(u => u.Id == studentId, ct);
            return new SubmissionResponse
            {
                Id = existingSubmission.Id,
                AssignmentId = assignment.Id,
                AssignmentTitle = assignment.Title,
                StudentId = student.Id,
                StudentName = student.FullName,
                StudentRoll = student.Roll,
                AnswerText = existingSubmission.AnswerText,
                Status = existingSubmission.Status.ToString(),
                SubmittedAt = existingSubmission.SubmittedAt,
                Marks = existingSubmission.Marks,
                Feedback = existingSubmission.Feedback,
                EvaluatedByUserId = existingSubmission.EvaluatedByUserId,
                EvaluatedByName = null,
                Attachments = existingSubmission.Attachments.Select(a => new AttachmentResponse
                {
                    Id = a.Id,
                    OriginalFileName = a.OriginalFileName,
                    ContentType = a.ContentType,
                    ByteSize = a.ByteSize
                }).ToList()
            };
        }

        var newSubmission = new Submission
        {
            Id = Guid.NewGuid(),
            AssignmentId = assignmentId,
            StudentId = studentId,
            AnswerText = request.AnswerText,
            SubmittedAt = DateTime.UtcNow,
            Status = isLate ? SubmissionStatus.Late : SubmissionStatus.Submitted
        };

        await unitOfWork.SubmissionRepo.Add(newSubmission);
        await unitOfWork.SaveChangesAsync(ct);

        var studentUser = await unitOfWork.UserRepo.GetAll().AsNoTracking().SingleAsync(u => u.Id == studentId, ct);
        return new SubmissionResponse
        {
            Id = newSubmission.Id,
            AssignmentId = assignment.Id,
            AssignmentTitle = assignment.Title,
            StudentId = studentUser.Id,
            StudentName = studentUser.FullName,
            StudentRoll = studentUser.Roll,
            AnswerText = newSubmission.AnswerText,
            Status = newSubmission.Status.ToString(),
            SubmittedAt = newSubmission.SubmittedAt,
            Marks = null,
            Feedback = null,
            EvaluatedByUserId = null,
            EvaluatedByName = null,
            Attachments = []
        };
    }

    public async Task<SubmissionResponse?> ReviewSubmissionAsync(Guid id, Guid teacherId, ReviewSubmissionRequest request, CancellationToken ct = default)
    {
        var submission = await unitOfWork.SubmissionRepo.GetAll()
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .Include(s => s.Attachments)
            .SingleOrDefaultAsync(s => s.Id == id, ct);

        if (submission is null)
        {
            return null;
        }

        var isAllocated = await unitOfWork.TeacherCourseAllocationRepo.GetAll()
            .AnyAsync(tca => tca.TeacherId == teacherId && tca.CourseId == submission.Assignment.CourseId && tca.Status == TeacherCourseAllocationStatus.Active, ct);

        if (!isAllocated)
        {
            throw new UnauthorizedAccessException("You are not allocated to the course for this submission.");
        }

        if (request.Marks < 0 || request.Marks > submission.Assignment.MaximumMarks)
        {
            throw new InvalidOperationException($"Marks must be between 0 and {submission.Assignment.MaximumMarks}.");
        }

        submission.Marks = request.Marks;
        submission.Feedback = request.Feedback;
        submission.Status = request.Status;
        submission.EvaluatedByUserId = teacherId;

        await unitOfWork.SaveChangesAsync(ct);

        var teacher = await unitOfWork.UserRepo.GetAll().AsNoTracking().SingleAsync(u => u.Id == teacherId, ct);

        return new SubmissionResponse
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            AssignmentTitle = submission.Assignment.Title,
            StudentId = submission.StudentId,
            StudentName = submission.Student.FullName,
            StudentRoll = submission.Student.Roll,
            AnswerText = submission.AnswerText,
            Status = submission.Status.ToString(),
            SubmittedAt = submission.SubmittedAt,
            Marks = submission.Marks,
            Feedback = submission.Feedback,
            EvaluatedByUserId = teacher.Id,
            EvaluatedByName = teacher.FullName,
            Attachments = submission.Attachments.Select(a => new AttachmentResponse
            {
                Id = a.Id,
                OriginalFileName = a.OriginalFileName,
                ContentType = a.ContentType,
                ByteSize = a.ByteSize
            }).ToList()
        };
    }

    private static SubmissionResponse MapToResponse(Submission s)
    {
        return new SubmissionResponse
        {
            Id = s.Id,
            AssignmentId = s.AssignmentId,
            AssignmentTitle = s.Assignment.Title,
            StudentId = s.StudentId,
            StudentName = s.Student.FullName,
            StudentRoll = s.Student.Roll,
            AnswerText = s.AnswerText,
            Status = s.Status.ToString(),
            SubmittedAt = s.SubmittedAt,
            Marks = s.Marks,
            Feedback = s.Feedback,
            EvaluatedByUserId = s.EvaluatedByUserId,
            EvaluatedByName = s.EvaluatedBy?.FullName,
            Attachments = s.Attachments.Select(a => new AttachmentResponse
            {
                Id = a.Id,
                OriginalFileName = a.OriginalFileName,
                ContentType = a.ContentType,
                ByteSize = a.ByteSize
            }).ToList()
        };
    }
}
