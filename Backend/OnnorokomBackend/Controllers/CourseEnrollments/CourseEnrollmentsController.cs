using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.CourseEnrollments;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.CourseEnrollments;

namespace OnnoRokomBackend.Controllers.CourseEnrollments;

[ApiController]
[Route("api/course-enrollments")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class CourseEnrollmentsController(ICourseEnrollmentService courseEnrollmentService) : ControllerBase, ICourseEnrollmentController
{
    [HttpGet("courses/{courseId:guid}/students")]
    public async Task<IActionResult> GetCourseStudents([FromRoute] Guid courseId, CancellationToken ct = default)
    {
        var students = await courseEnrollmentService.GetCourseStudentsAsync(courseId, ct);
        return Ok(students);
    }

    [HttpGet("students/{studentId:guid}/courses")]
    public async Task<IActionResult> GetStudentCourses([FromRoute] Guid studentId, CancellationToken ct = default)
    {
        var courses = await courseEnrollmentService.GetStudentCoursesAsync(studentId, ct);
        return Ok(courses);
    }

    [HttpPost]
    public async Task<IActionResult> EnrollStudents([FromBody] EnrollStudentsRequest request, CancellationToken ct = default)
    {
        var enrolledStudents = await courseEnrollmentService.EnrollStudentsAsync(request, ct);
        return Created($"api/course-enrollments/courses/{request.CourseId}/students", enrolledStudents);
    }

    [HttpPatch("{enrollmentId:guid}/status")]
    public async Task<IActionResult> SetStatus([FromRoute] Guid enrollmentId, [FromBody] SetCourseEnrollmentStatusRequest request, CancellationToken ct = default)
    {
        var success = await courseEnrollmentService.SetCourseEnrollmentStatusAsync(enrollmentId, request, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Course Enrollment Not Found",
                Detail = $"Course enrollment with ID '{enrollmentId}' was not found."
            });
        }

        return NoContent();
    }
}
