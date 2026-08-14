namespace OnnoRokomBackend.Models.DTOs.Assignments;

public class AssignmentResponse
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DeadlineAt { get; set; }
    public decimal MaximumMarks { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool AllowResubmission { get; set; }
    public DateTime? SubmissionsClosedAt { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
}
