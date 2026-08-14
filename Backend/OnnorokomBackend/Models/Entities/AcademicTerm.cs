namespace OnnoRokomBackend.Models.Entities;

public class AcademicTerm
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }

    public ICollection<AcademicBatch> Batches { get; set; } = [];
}
