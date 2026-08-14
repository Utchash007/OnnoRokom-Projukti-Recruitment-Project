namespace OnnoRokomBackend.Models.Entities;

public class AcademicBatch
{
    public Guid Id { get; set; }
    public Guid TermId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public AcademicTerm Term { get; set; } = null!;
    public ICollection<BatchEnrollment> Enrollments { get; set; } = [];
}
