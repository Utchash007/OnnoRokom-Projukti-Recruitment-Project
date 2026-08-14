using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.Entities;

public class User
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public int AuthVersion { get; set; } = 1;

    public ICollection<BatchEnrollment> BatchEnrollments { get; set; } = [];
    public ICollection<TeacherCourseAllocation> TeacherCourseAllocations { get; set; } = [];
    public ICollection<Assignment> CreatedAssignments { get; set; } = [];
    public ICollection<Submission> Submissions { get; set; } = [];
    public ICollection<Submission> EvaluatedSubmissions { get; set; } = [];
}
