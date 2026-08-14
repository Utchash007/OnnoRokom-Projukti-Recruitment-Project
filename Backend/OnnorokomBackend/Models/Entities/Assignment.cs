using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class Assignment
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DeadlineAt { get; set; }
    public decimal MaximumMarks { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;
    public bool AllowResubmission { get; set; }
    public DateTime? SubmissionsClosedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Course Course { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public ICollection<Submission> Submissions { get; set; } = [];
}
