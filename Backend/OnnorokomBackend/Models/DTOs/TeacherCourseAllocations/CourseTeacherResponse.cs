namespace OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

public class CourseTeacherResponse
{
    public Guid AllocationId { get; set; }
    public Guid TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public string TeacherEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
