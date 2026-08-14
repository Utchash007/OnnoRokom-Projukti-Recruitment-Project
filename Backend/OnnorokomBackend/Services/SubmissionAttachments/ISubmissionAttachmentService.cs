using Microsoft.AspNetCore.Http;
using OnnoRokomBackend.Models.DTOs.SubmissionAttachments;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Services.SubmissionAttachments;

public interface ISubmissionAttachmentService
{
    Task<AttachmentResponse> AddAttachmentAsync(Guid submissionId, Guid studentId, IFormFile file, CancellationToken ct = default);
    Task<(byte[] Data, string ContentType, string FileName)?> DownloadAttachmentAsync(Guid attachmentId, Guid userId, UserRole role, CancellationToken ct = default);
    Task<bool> DeleteAttachmentAsync(Guid attachmentId, Guid studentId, CancellationToken ct = default);
}
