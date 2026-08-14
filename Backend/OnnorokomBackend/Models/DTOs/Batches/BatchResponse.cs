namespace OnnoRokomBackend.Models.DTOs.Batches;

public class BatchResponse
{
    public Guid Id { get; set; }
    public Guid TermId { get; set; }
    public string TermCode { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
