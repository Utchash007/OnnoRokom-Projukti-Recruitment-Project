using OnnoRokomBackend.Models.DTOs.Submissions;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Services.Submissions;

public interface ISubmissionService
{
    Task<List<SubmissionResponse>> GetMySubmissionsAsync(Guid studentId, CancellationToken ct = default);
    Task<List<SubmissionResponse>> GetAssignmentSubmissionsAsync(Guid assignmentId, Guid userId, UserRole role, CancellationToken ct = default);
    Task<SubmissionResponse?> GetSubmissionByIdAsync(Guid id, Guid userId, UserRole role, CancellationToken ct = default);
    Task<SubmissionResponse> UpsertSubmissionAsync(Guid assignmentId, Guid studentId, UpsertSubmissionRequest request, CancellationToken ct = default);
    Task<SubmissionResponse?> ReviewSubmissionAsync(Guid id, Guid teacherId, ReviewSubmissionRequest request, CancellationToken ct = default);
}
