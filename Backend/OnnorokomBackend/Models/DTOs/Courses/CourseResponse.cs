namespace OnnoRokomBackend.Models.DTOs.Courses;

public class CourseResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
