using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Assignments;

namespace OnnoRokomBackend.Controllers.Assignments;

public interface IAssignmentController
{
    Task<IActionResult> GetAll([FromQuery] Guid? courseId, CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Create([FromBody] CreateAssignmentRequest request, CancellationToken ct = default);
    Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateAssignmentRequest request, CancellationToken ct = default);
    Task<IActionResult> Publish([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> CloseSubmissions([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default);
}
