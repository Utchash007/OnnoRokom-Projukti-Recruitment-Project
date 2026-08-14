using OnnoRokomBackend.Models.DTOs.Batches;

namespace OnnoRokomBackend.Services.Batches;

public interface IBatchService
{
    Task<List<BatchResponse>> GetBatchesAsync(CancellationToken ct = default);
    Task<BatchResponse?> GetBatchByIdAsync(Guid id, CancellationToken ct = default);
    Task<BatchResponse> CreateBatchAsync(CreateBatchRequest request, CancellationToken ct = default);
    Task<BatchResponse?> UpdateBatchAsync(Guid id, UpdateBatchRequest request, CancellationToken ct = default);
    Task<bool> DeleteBatchAsync(Guid id, CancellationToken ct = default);
    Task<List<BatchStudentResponse>> GetBatchStudentsAsync(Guid batchId, CancellationToken ct = default);
    Task<BatchStudentResponse> AssignStudentAsync(Guid batchId, AssignStudentRequest request, CancellationToken ct = default);
    Task<bool> SetBatchEnrollmentStatusAsync(Guid enrollmentId, SetBatchEnrollmentStatusRequest request, CancellationToken ct = default);
}
