using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OnnoRokomBackend.Controllers.SubmissionAttachments;

public interface ISubmissionAttachmentController
{
    Task<IActionResult> Upload([FromRoute] Guid submissionId, IFormFile file, CancellationToken ct = default);
    Task<IActionResult> Download([FromRoute] Guid attachmentId, CancellationToken ct = default);
    Task<IActionResult> Delete([FromRoute] Guid attachmentId, CancellationToken ct = default);
}
