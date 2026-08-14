using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OnnoRokomBackend.Configuration;
using OnnoRokomBackend.Models.DTOs.SubmissionAttachments;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.SubmissionAttachments;

public class SubmissionAttachmentService(IUnitOfWork unitOfWork, IOptions<FileUploadOptions> fileUploadOptions) : ISubmissionAttachmentService
{
    private readonly FileUploadOptions _fileOptions = fileUploadOptions.Value;

    public async Task<AttachmentResponse> AddAttachmentAsync(Guid submissionId, Guid studentId, IFormFile file, CancellationToken ct = default)
    {
        if (file.Length == 0)
        {
            throw new InvalidOperationException("Uploaded file is empty.");
        }

        if (file.Length > _fileOptions.MaxFileSizeBytes)
        {
            throw new InvalidOperationException($"File size exceeds the maximum allowed limit of {_fileOptions.MaxFileSizeBytes / 1024 / 1024} MB.");
        }

        if (_fileOptions.AllowedContentTypes.Count > 0 && !_fileOptions.AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            throw new InvalidOperationException($"File type '{file.ContentType}' is not permitted.");
        }

        var submission = await unitOfWork.Context.Submissions
            .Include(s => s.Assignment)
            .SingleOrDefaultAsync(s => s.Id == submissionId, ct);

        if (submission is null)
        {
            throw new KeyNotFoundException($"Submission with ID '{submissionId}' was not found.");
        }

        if (submission.StudentId != studentId)
        {
            throw new UnauthorizedAccessException("You are not authorized to attach files to this submission.");
        }

        if (submission.Assignment.SubmissionsClosedAt.HasValue)
        {
            throw new InvalidOperationException("Submissions for this assignment are closed.");
        }

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream, ct);
        var fileBytes = memoryStream.ToArray();

        var attachment = new SubmissionAttachment
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            OriginalFileName = Path.GetFileName(file.FileName),
            ContentType = file.ContentType,
            ByteSize = file.Length,
            FileData = fileBytes
        };

        unitOfWork.Context.SubmissionAttachments.Add(attachment);
        await unitOfWork.SaveChangesAsync(ct);

        return new AttachmentResponse
        {
            Id = attachment.Id,
            OriginalFileName = attachment.OriginalFileName,
            ContentType = attachment.ContentType,
            ByteSize = attachment.ByteSize
        };
    }

    public async Task<(byte[] Data, string ContentType, string FileName)?> DownloadAttachmentAsync(
        Guid attachmentId,
        Guid userId,
        UserRole role,
        CancellationToken ct = default)
    {
        var attachment = await unitOfWork.Context.SubmissionAttachments
            .AsNoTracking()
            .Include(a => a.Submission)
                .ThenInclude(s => s.Assignment)
            .SingleOrDefaultAsync(a => a.Id == attachmentId, ct);

        if (attachment is null)
        {
            return null;
        }

        if (role == UserRole.Student)
        {
            if (attachment.Submission.StudentId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to download this attachment.");
            }
        }
        else if (role == UserRole.Teacher)
        {
            var isAllocated = await unitOfWork.Context.TeacherCourseAllocations
                .AnyAsync(tca => tca.TeacherId == userId
                                && tca.CourseId == attachment.Submission.Assignment.CourseId
                                && tca.Status == TeacherCourseAllocationStatus.Active, ct);

            if (!isAllocated)
            {
                throw new UnauthorizedAccessException("You are not allocated to the course for this attachment.");
            }
        }

        return (attachment.FileData, attachment.ContentType, attachment.OriginalFileName);
    }

    public async Task<bool> DeleteAttachmentAsync(Guid attachmentId, Guid studentId, CancellationToken ct = default)
    {
        var attachment = await unitOfWork.Context.SubmissionAttachments
            .Include(a => a.Submission)
                .ThenInclude(s => s.Assignment)
            .SingleOrDefaultAsync(a => a.Id == attachmentId, ct);

        if (attachment is null)
        {
            return false;
        }

        if (attachment.Submission.StudentId != studentId)
        {
            throw new UnauthorizedAccessException("You are not authorized to delete this attachment.");
        }

        if (attachment.Submission.Assignment.SubmissionsClosedAt.HasValue)
        {
            throw new InvalidOperationException("Submissions for this assignment are closed.");
        }

        unitOfWork.Context.SubmissionAttachments.Remove(attachment);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
