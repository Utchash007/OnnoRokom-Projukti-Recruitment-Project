using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Helpers;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.SubmissionAttachments;

namespace OnnoRokomBackend.Controllers.SubmissionAttachments;

[ApiController]
[Route("api/submission-attachments")]
[Authorize]
public class SubmissionAttachmentsController(ISubmissionAttachmentService attachmentService) : ControllerBase, ISubmissionAttachmentController
{
    [HttpPost("submissions/{submissionId:guid}")]
    [Authorize(Roles = nameof(UserRole.Student))]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromRoute] Guid submissionId, IFormFile file, CancellationToken ct = default)
    {
        var studentId = User.GetUserId();
        var attachment = await attachmentService.AddAttachmentAsync(submissionId, studentId, file, ct);
        return Created($"api/submission-attachments/{attachment.Id}", attachment);
    }

    [HttpGet("{attachmentId:guid}")]
    public async Task<IActionResult> Download([FromRoute] Guid attachmentId, CancellationToken ct = default)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var result = await attachmentService.DownloadAttachmentAsync(attachmentId, userId, role, ct);
        if (result is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Attachment Not Found",
                Detail = $"Attachment with ID '{attachmentId}' was not found or is not accessible."
            });
        }

        return File(result.Value.Data, result.Value.ContentType, result.Value.FileName);
    }

    [HttpDelete("{attachmentId:guid}")]
    [Authorize(Roles = nameof(UserRole.Student))]
    public async Task<IActionResult> Delete([FromRoute] Guid attachmentId, CancellationToken ct = default)
    {
        var studentId = User.GetUserId();
        var success = await attachmentService.DeleteAttachmentAsync(attachmentId, studentId, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Attachment Not Found",
                Detail = $"Attachment with ID '{attachmentId}' was not found."
            });
        }

        return NoContent();
    }
}
