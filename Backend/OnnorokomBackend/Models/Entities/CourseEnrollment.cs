using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class CourseEnrollment
{
    public Guid Id { get; set; }
    public Guid BatchEnrollmentId { get; set; }
    public Guid CourseId { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

    public BatchEnrollment BatchEnrollment { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
