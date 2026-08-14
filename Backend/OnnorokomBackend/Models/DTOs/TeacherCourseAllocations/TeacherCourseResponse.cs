namespace OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

public class TeacherCourseResponse
{
    public Guid AllocationId { get; set; }
    public Guid CourseId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
