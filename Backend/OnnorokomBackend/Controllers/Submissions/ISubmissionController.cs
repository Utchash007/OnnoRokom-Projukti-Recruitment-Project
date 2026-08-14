using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Submissions;

namespace OnnoRokomBackend.Controllers.Submissions;

public interface ISubmissionController
{
    Task<IActionResult> GetMine(CancellationToken ct = default);
    Task<IActionResult> GetForAssignment([FromRoute] Guid assignmentId, CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> SubmitOrUpdate([FromRoute] Guid assignmentId, [FromBody] UpsertSubmissionRequest request, CancellationToken ct = default);
    Task<IActionResult> Review([FromRoute] Guid id, [FromBody] ReviewSubmissionRequest request, CancellationToken ct = default);
}
