using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.AcademicTerms;

namespace OnnoRokomBackend.Controllers.AcademicTerms;

public interface IAcademicTermsController
{
    Task<IActionResult> GetAll(CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Create([FromBody] CreateAcademicTermRequest request, CancellationToken ct = default);
    Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateAcademicTermRequest request, CancellationToken ct = default);
    Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default);
}
