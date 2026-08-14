using System.ComponentModel.DataAnnotations;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.DTOs.Batches;

public class SetBatchEnrollmentStatusRequest
{
    [Required]
    public EnrollmentStatus Status { get; set; }
}
