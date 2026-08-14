using OnnoRokomBackend.Models.DTOs.Assignments;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Services.Assignments;

public interface IAssignmentService
{
    Task<List<AssignmentResponse>> GetAssignmentsAsync(Guid userId, UserRole role, Guid? courseIdFilter, CancellationToken ct = default);
    Task<AssignmentResponse?> GetAssignmentByIdAsync(Guid id, Guid userId, UserRole role, CancellationToken ct = default);
    Task<AssignmentResponse> CreateAssignmentAsync(Guid teacherId, CreateAssignmentRequest request, CancellationToken ct = default);
    Task<AssignmentResponse?> UpdateAssignmentAsync(Guid id, Guid teacherId, UpdateAssignmentRequest request, CancellationToken ct = default);
    Task<bool> PublishAssignmentAsync(Guid id, Guid teacherId, CancellationToken ct = default);
    Task<bool> CloseSubmissionsAsync(Guid id, Guid teacherId, CancellationToken ct = default);
    Task<bool> DeleteAssignmentAsync(Guid id, Guid teacherId, CancellationToken ct = default);
}
