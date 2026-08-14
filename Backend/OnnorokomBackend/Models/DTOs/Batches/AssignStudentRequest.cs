using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Batches;

public class AssignStudentRequest
{
    [Required]
    public Guid StudentId { get; set; }
}
