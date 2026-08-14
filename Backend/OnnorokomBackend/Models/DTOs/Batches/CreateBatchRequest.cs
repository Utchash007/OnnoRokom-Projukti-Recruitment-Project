using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Batches;

public class CreateBatchRequest
{
    [Required]
    public Guid TermId { get; set; }

    [Required]
    public string Code { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;
}
