using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.TeacherCourseAllocations;

namespace OnnoRokomBackend.Controllers.TeacherCourseAllocations;

[ApiController]
[Route("api/teacher-allocations")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class TeacherCourseAllocationsController(ITeacherCourseAllocationService allocationService) : ControllerBase, ITeacherCourseAllocationController
{
    [HttpGet("courses/{courseId:guid}/teachers")]
    public async Task<IActionResult> GetCourseTeachers([FromRoute] Guid courseId, CancellationToken ct = default)
    {
        var teachers = await allocationService.GetCourseTeachersAsync(courseId, ct);
        return Ok(teachers);
    }

    [HttpGet("teachers/{teacherId:guid}/courses")]
    public async Task<IActionResult> GetTeacherCourses([FromRoute] Guid teacherId, CancellationToken ct = default)
    {
        var courses = await allocationService.GetTeacherCoursesAsync(teacherId, ct);
        return Ok(courses);
    }

    [HttpPost]
    public async Task<IActionResult> AllocateTeacher([FromBody] AllocateTeacherRequest request, CancellationToken ct = default)
    {
        var allocation = await allocationService.AllocateTeacherAsync(request, ct);
        return Created($"api/teacher-allocations/courses/{request.CourseId}/teachers", allocation);
    }

    [HttpPatch("{allocationId:guid}/status")]
    public async Task<IActionResult> SetStatus([FromRoute] Guid allocationId, [FromBody] SetAllocationStatusRequest request, CancellationToken ct = default)
    {
        var success = await allocationService.SetTeacherCourseAllocationStatusAsync(allocationId, request, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Allocation Not Found",
                Detail = $"Teacher allocation with ID '{allocationId}' was not found."
            });
        }

        return NoContent();
    }
}
