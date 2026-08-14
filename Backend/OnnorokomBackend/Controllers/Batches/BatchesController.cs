using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Batches;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.Batches;

namespace OnnoRokomBackend.Controllers.Batches;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class BatchesController(IBatchService batchService) : ControllerBase, IBatchController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var batches = await batchService.GetBatchesAsync(ct);
        return Ok(batches);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var batch = await batchService.GetBatchByIdAsync(id, ct);
        if (batch is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Batch Not Found",
                Detail = $"Batch with ID '{id}' was not found."
            });
        }

        return Ok(batch);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBatchRequest request, CancellationToken ct = default)
    {
        var createdBatch = await batchService.CreateBatchAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = createdBatch.Id }, createdBatch);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateBatchRequest request, CancellationToken ct = default)
    {
        var updatedBatch = await batchService.UpdateBatchAsync(id, request, ct);
        if (updatedBatch is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Batch Not Found",
                Detail = $"Batch with ID '{id}' was not found."
            });
        }

        return Ok(updatedBatch);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default)
    {
        var success = await batchService.DeleteBatchAsync(id, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Batch Not Found",
                Detail = $"Batch with ID '{id}' was not found."
            });
        }

        return NoContent();
    }

    [HttpGet("{id:guid}/students")]
    public async Task<IActionResult> GetStudents([FromRoute] Guid id, CancellationToken ct = default)
    {
        var students = await batchService.GetBatchStudentsAsync(id, ct);
        return Ok(students);
    }

    [HttpPost("{id:guid}/students")]
    public async Task<IActionResult> AssignStudent([FromRoute] Guid id, [FromBody] AssignStudentRequest request, CancellationToken ct = default)
    {
        var enrollment = await batchService.AssignStudentAsync(id, request, ct);
        return Created($"api/batches/{id}/students/{enrollment.EnrollmentId}", enrollment);
    }

    [HttpPatch("{id:guid}/enrollments/{enrollmentId:guid}/status")]
    public async Task<IActionResult> SetStudentEnrollmentStatus(
        [FromRoute] Guid id,
        [FromRoute] Guid enrollmentId,
        [FromBody] SetBatchEnrollmentStatusRequest request,
        CancellationToken ct = default)
    {
        var success = await batchService.SetBatchEnrollmentStatusAsync(enrollmentId, request, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Enrollment Not Found",
                Detail = $"Batch enrollment with ID '{enrollmentId}' was not found."
            });
        }

        return NoContent();
    }
}
