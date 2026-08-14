using OnnoRokomBackend.Models.DTOs.AcademicTerms;

namespace OnnoRokomBackend.Services.AcademicTerms;

public interface IAcademicTermService
{
    Task<List<AcademicTermResponse>> GetAcademicTermsAsync(CancellationToken ct = default);
    Task<AcademicTermResponse?> GetAcademicTermByIdAsync(Guid id, CancellationToken ct = default);
    Task<AcademicTermResponse> CreateAcademicTermAsync(CreateAcademicTermRequest request, CancellationToken ct = default);
    Task<AcademicTermResponse?> UpdateAcademicTermAsync(Guid id, UpdateAcademicTermRequest request, CancellationToken ct = default);
    Task<bool> DeleteAcademicTermAsync(Guid id, CancellationToken ct = default);
}
