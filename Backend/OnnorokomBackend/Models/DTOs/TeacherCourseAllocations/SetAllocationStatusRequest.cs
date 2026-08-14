using System.ComponentModel.DataAnnotations;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

public class SetAllocationStatusRequest
{
    [Required]
    public TeacherCourseAllocationStatus Status { get; set; }
}
