namespace OnnoRokomBackend.Models.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = [];
    public ICollection<TeacherCourseAllocation> TeacherAllocations { get; set; } = [];
    public ICollection<Assignment> Assignments { get; set; } = [];
}
