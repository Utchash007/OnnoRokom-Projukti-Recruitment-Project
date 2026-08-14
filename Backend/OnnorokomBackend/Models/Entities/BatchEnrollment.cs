using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class BatchEnrollment
{
    public Guid Id { get; set; }
    public Guid BatchId { get; set; }
    public Guid StudentId { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

    public AcademicBatch Batch { get; set; } = null!;
    public User Student { get; set; } = null!;
    public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = [];
}
