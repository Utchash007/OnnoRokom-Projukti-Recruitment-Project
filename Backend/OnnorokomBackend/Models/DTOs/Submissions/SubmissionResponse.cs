using OnnoRokomBackend.Models.DTOs.SubmissionAttachments;

namespace OnnoRokomBackend.Models.DTOs.Submissions;

public class SubmissionResponse
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string? StudentRoll { get; set; }
    public string? AnswerText { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public decimal? Marks { get; set; }
    public string? Feedback { get; set; }
    public Guid? EvaluatedByUserId { get; set; }
    public string? EvaluatedByName { get; set; }
    public List<AttachmentResponse> Attachments { get; set; } = [];
}
