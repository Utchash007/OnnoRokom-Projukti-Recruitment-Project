using OnnoRokomBackend.Models.DTOs.CourseEnrollments;

namespace OnnoRokomBackend.Services.CourseEnrollments;

public interface ICourseEnrollmentService
{
    Task<List<CourseStudentResponse>> GetCourseStudentsAsync(Guid courseId, CancellationToken ct = default);
    Task<List<StudentCourseResponse>> GetStudentCoursesAsync(Guid studentId, CancellationToken ct = default);
    Task<List<CourseStudentResponse>> EnrollStudentsAsync(EnrollStudentsRequest request, CancellationToken ct = default);
    Task<bool> SetCourseEnrollmentStatusAsync(Guid enrollmentId, SetCourseEnrollmentStatusRequest request, CancellationToken ct = default);
}
