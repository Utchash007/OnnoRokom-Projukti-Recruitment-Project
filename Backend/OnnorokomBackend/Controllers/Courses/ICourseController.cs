using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Courses;

namespace OnnoRokomBackend.Controllers.Courses;

public interface ICourseController
{
    Task<IActionResult> GetAll(CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Create([FromBody] CreateCourseRequest request, CancellationToken ct = default);
    Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCourseRequest request, CancellationToken ct = default);
    Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default);
}
