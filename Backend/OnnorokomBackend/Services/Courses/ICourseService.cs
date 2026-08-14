using OnnoRokomBackend.Models.DTOs.Courses;

namespace OnnoRokomBackend.Services.Courses;

public interface ICourseService
{
    Task<List<CourseResponse>> GetCoursesAsync(CancellationToken ct = default);
    Task<CourseResponse?> GetCourseByIdAsync(Guid id, CancellationToken ct = default);
    Task<CourseResponse> CreateCourseAsync(CreateCourseRequest request, CancellationToken ct = default);
    Task<CourseResponse?> UpdateCourseAsync(Guid id, UpdateCourseRequest request, CancellationToken ct = default);
    Task<bool> DeleteCourseAsync(Guid id, CancellationToken ct = default);
}
