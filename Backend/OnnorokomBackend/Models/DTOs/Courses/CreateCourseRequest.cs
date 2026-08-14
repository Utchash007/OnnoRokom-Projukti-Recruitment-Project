using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Courses;

public class CreateCourseRequest
{
    [Required]
    public string Code { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
}
