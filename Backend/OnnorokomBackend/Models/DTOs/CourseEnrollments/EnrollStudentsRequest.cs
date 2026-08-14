using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.CourseEnrollments;

public class EnrollStudentsRequest
{
    [Required]
    public Guid CourseId { get; set; }

    [Required, MinLength(1)]
    public List<Guid> BatchEnrollmentIds { get; set; } = [];
}
