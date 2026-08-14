using System.ComponentModel.DataAnnotations;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.DTOs.Submissions;

public class ReviewSubmissionRequest
{
    [Required, Range(0, double.MaxValue)]
    public decimal Marks { get; set; }

    public string? Feedback { get; set; }

    [Required]
    public SubmissionStatus Status { get; set; }
}
