namespace OnnoRokomBackend.Models.DTOs.CourseEnrollments;

public class StudentCourseResponse
{
    public Guid EnrollmentId { get; set; }
    public Guid CourseId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
