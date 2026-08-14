using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Batches;

namespace OnnoRokomBackend.Controllers.Batches;

public interface IBatchController
{
    Task<IActionResult> GetAll(CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Create([FromBody] CreateBatchRequest request, CancellationToken ct = default);
    Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateBatchRequest request, CancellationToken ct = default);
    Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> GetStudents([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> AssignStudent([FromRoute] Guid id, [FromBody] AssignStudentRequest request, CancellationToken ct = default);
    Task<IActionResult> SetStudentEnrollmentStatus([FromRoute] Guid id, [FromRoute] Guid enrollmentId, [FromBody] SetBatchEnrollmentStatusRequest request, CancellationToken ct = default);
}
