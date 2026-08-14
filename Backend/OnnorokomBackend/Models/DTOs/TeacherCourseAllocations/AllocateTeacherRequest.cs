using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

public class AllocateTeacherRequest
{
    [Required]
    public Guid TeacherId { get; set; }

    [Required]
    public Guid CourseId { get; set; }
}
