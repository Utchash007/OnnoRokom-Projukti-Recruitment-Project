using OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;

namespace OnnoRokomBackend.Services.TeacherCourseAllocations;

public interface ITeacherCourseAllocationService
{
    Task<List<CourseTeacherResponse>> GetCourseTeachersAsync(Guid courseId, CancellationToken ct = default);
    Task<List<TeacherCourseResponse>> GetTeacherCoursesAsync(Guid teacherId, CancellationToken ct = default);
    Task<CourseTeacherResponse> AllocateTeacherAsync(AllocateTeacherRequest request, CancellationToken ct = default);
    Task<bool> SetTeacherCourseAllocationStatusAsync(Guid allocationId, SetAllocationStatusRequest request, CancellationToken ct = default);
}
