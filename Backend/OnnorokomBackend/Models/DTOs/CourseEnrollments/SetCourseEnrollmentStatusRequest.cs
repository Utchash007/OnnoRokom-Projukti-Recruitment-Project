using System.ComponentModel.DataAnnotations;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.DTOs.CourseEnrollments;

public class SetCourseEnrollmentStatusRequest
{
    [Required]
    public EnrollmentStatus Status { get; set; }
}
