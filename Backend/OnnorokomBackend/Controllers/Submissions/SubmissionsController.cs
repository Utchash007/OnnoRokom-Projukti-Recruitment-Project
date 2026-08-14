using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Helpers;
using OnnoRokomBackend.Models.DTOs.Submissions;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.Submissions;

namespace OnnoRokomBackend.Controllers.Submissions;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController(ISubmissionService submissionService) : ControllerBase, ISubmissionController
{
    [HttpGet("mine")]
    [Authorize(Roles = nameof(UserRole.Student))]
    public async Task<IActionResult> GetMine(CancellationToken ct = default)
    {
        var studentId = User.GetUserId();
        var submissions = await submissionService.GetMySubmissionsAsync(studentId, ct);
        return Ok(submissions);
    }

    [HttpGet("assignments/{assignmentId:guid}")]
    [Authorize(Roles = $"{nameof(UserRole.Teacher)},{nameof(UserRole.Admin)}")]
    public async Task<IActionResult> GetForAssignment([FromRoute] Guid assignmentId, CancellationToken ct = default)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var submissions = await submissionService.GetAssignmentSubmissionsAsync(assignmentId, userId, role, ct);
        return Ok(submissions);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var submission = await submissionService.GetSubmissionByIdAsync(id, userId, role, ct);
        if (submission is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Submission Not Found",
                Detail = $"Submission with ID '{id}' was not found or is not accessible."
            });
        }

        return Ok(submission);
    }

    [HttpPost("assignments/{assignmentId:guid}")]
    [Authorize(Roles = nameof(UserRole.Student))]
    public async Task<IActionResult> SubmitOrUpdate(
        [FromRoute] Guid assignmentId,
        [FromBody] UpsertSubmissionRequest request,
        CancellationToken ct = default)
    {
        var studentId = User.GetUserId();
        var submission = await submissionService.UpsertSubmissionAsync(assignmentId, studentId, request, ct);
        return Ok(submission);
    }

    [HttpPatch("{id:guid}/review")]
    [Authorize(Roles = nameof(UserRole.Teacher))]
    public async Task<IActionResult> Review(
        [FromRoute] Guid id,
        [FromBody] ReviewSubmissionRequest request,
        CancellationToken ct = default)
    {
        var teacherId = User.GetUserId();
        var reviewedSubmission = await submissionService.ReviewSubmissionAsync(id, teacherId, request, ct);
        if (reviewedSubmission is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Submission Not Found",
                Detail = $"Submission with ID '{id}' was not found."
            });
        }

        return Ok(reviewedSubmission);
    }
}
