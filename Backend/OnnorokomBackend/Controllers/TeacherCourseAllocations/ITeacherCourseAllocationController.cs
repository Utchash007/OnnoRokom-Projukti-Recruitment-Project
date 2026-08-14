using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

namespace OnnoRokomBackend.Controllers.TeacherCourseAllocations;

public interface ITeacherCourseAllocationController
{
    Task<IActionResult> GetCourseTeachers([FromRoute] Guid courseId, CancellationToken ct = default);
    Task<IActionResult> GetTeacherCourses([FromRoute] Guid teacherId, CancellationToken ct = default);
    Task<IActionResult> AllocateTeacher([FromBody] AllocateTeacherRequest request, CancellationToken ct = default);
    Task<IActionResult> SetStatus([FromRoute] Guid allocationId, [FromBody] SetAllocationStatusRequest request, CancellationToken ct = default);
}
