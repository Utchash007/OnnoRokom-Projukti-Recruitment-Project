namespace OnnoRokomBackend.Models.DTOs.Batches;

public class BatchStudentResponse
{
    public Guid EnrollmentId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string? StudentRoll { get; set; }
    public string Status { get; set; } = string.Empty;
}
