using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Assignments;

public class UpdateAssignmentRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime DeadlineAt { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal MaximumMarks { get; set; }

    public bool AllowResubmission { get; set; }
}
