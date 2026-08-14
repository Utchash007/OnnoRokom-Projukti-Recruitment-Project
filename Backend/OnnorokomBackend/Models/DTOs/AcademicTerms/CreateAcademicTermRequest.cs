using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.AcademicTerms;

public class CreateAcademicTermRequest
{
    [Required]
    public string Code { get; set; } = string.Empty;

    [Required]
    public DateOnly StartsOn { get; set; }

    [Required]
    public DateOnly EndsOn { get; set; }
}
