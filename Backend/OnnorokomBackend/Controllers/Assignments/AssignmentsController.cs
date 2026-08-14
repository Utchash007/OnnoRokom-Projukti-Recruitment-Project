using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Helpers;
using OnnoRokomBackend.Models.DTOs.Assignments;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.Assignments;

namespace OnnoRokomBackend.Controllers.Assignments;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController(IAssignmentService assignmentService) : ControllerBase, IAssignmentController
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? courseId, CancellationToken ct = default)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var assignments = await assignmentService.GetAssignmentsAsync(userId, role, courseId, ct);
        return Ok(assignments);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var assignment = await assignmentService.GetAssignmentByIdAsync(id, userId, role, ct);
        if (assignment is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Assignment Not Found",
                Detail = $"Assignment with ID '{id}' was not found or is not accessible."
            });
        }

        return Ok(assignment);
    }

    [HttpPost]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentRequest request, CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var createdAssignment = await assignmentService.CreateAssignmentAsync(teacherId, request, ct);
        return CreatedAtAction(nameof(GetById), new { id = createdAssignment.Id }, createdAssignment);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateAssignmentRequest request, CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var updatedAssignment = await assignmentService.UpdateAssignmentAsync(id, teacherId, request, ct);
        if (updatedAssignment is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Assignment Not Found",
                Detail = $"Assignment with ID '{id}' was not found."
            });
        }

        return Ok(updatedAssignment);
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> Publish([FromRoute] Guid id, CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var success = await assignmentService.PublishAssignmentAsync(id, teacherId, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Assignment Not Found",
                Detail = $"Assignment with ID '{id}' was not found."
            });
        }

        return NoContent();
    }

    [HttpPatch("{id:guid}/close-submissions")]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> CloseSubmissions([FromRoute] Guid id, CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var success = await assignmentService.CloseSubmissionsAsync(id, teacherId, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Assignment Not Found",
                Detail = $"Assignment with ID '{id}' was not found."
            });
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var success = await assignmentService.DeleteAssignmentAsync(id, teacherId, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Assignment Not Found",
                Detail = $"Assignment with ID '{id}' was not found."
            });
        }

        return NoContent();
    }
}
