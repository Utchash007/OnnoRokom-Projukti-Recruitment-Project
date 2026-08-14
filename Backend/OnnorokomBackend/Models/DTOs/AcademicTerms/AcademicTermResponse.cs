namespace OnnoRokomBackend.Models.DTOs.AcademicTerms;

public class AcademicTermResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }
}
