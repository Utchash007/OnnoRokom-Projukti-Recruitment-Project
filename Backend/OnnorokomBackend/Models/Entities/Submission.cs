using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class Submission
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public string? AnswerText { get; set; }
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
    public DateTime SubmittedAt { get; set; }
    public decimal? Marks { get; set; }
    public string? Feedback { get; set; }
    public Guid? EvaluatedByUserId { get; set; }

    public Assignment Assignment { get; set; } = null!;
    public User Student { get; set; } = null!;
    public User? EvaluatedBy { get; set; }
    public ICollection<SubmissionAttachment> Attachments { get; set; } = [];
}
