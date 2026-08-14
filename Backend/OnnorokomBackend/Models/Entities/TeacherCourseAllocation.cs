using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class TeacherCourseAllocation
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public Guid CourseId { get; set; }
    public TeacherCourseAllocationStatus Status { get; set; } = TeacherCourseAllocationStatus.Active;

    public User Teacher { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
