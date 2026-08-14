using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.CourseEnrollments;

namespace OnnoRokomBackend.Controllers.CourseEnrollments;

public interface ICourseEnrollmentController
{
    Task<IActionResult> GetCourseStudents([FromRoute] Guid courseId, CancellationToken ct = default);
    Task<IActionResult> GetStudentCourses([FromRoute] Guid studentId, CancellationToken ct = default);
    Task<IActionResult> EnrollStudents([FromBody] EnrollStudentsRequest request, CancellationToken ct = default);
    Task<IActionResult> SetStatus([FromRoute] Guid enrollmentId, [FromBody] SetCourseEnrollmentStatusRequest request, CancellationToken ct = default);
}
