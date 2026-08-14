using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.TeacherCourseAllocations;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.TeacherCourseAllocations;

public class TeacherCourseAllocationService(IUnitOfWork unitOfWork) : ITeacherCourseAllocationService
{
    public async Task<List<CourseTeacherResponse>> GetCourseTeachersAsync(Guid courseId, CancellationToken ct = default)
    {
        return await unitOfWork.Context.TeacherCourseAllocations
            .AsNoTracking()
            .Where(a => a.CourseId == courseId)
            .Include(a => a.Teacher)
            .OrderBy(a => a.Teacher.FullName)
            .Select(a => new CourseTeacherResponse
            {
                AllocationId = a.Id,
                TeacherId = a.TeacherId,
                TeacherName = a.Teacher.FullName,
                TeacherEmail = a.Teacher.Email,
                Status = a.Status.ToString()
            })
            .ToListAsync(ct);
    }

    public async Task<List<TeacherCourseResponse>> GetTeacherCoursesAsync(Guid teacherId, CancellationToken ct = default)
    {
        return await unitOfWork.Context.TeacherCourseAllocations
            .AsNoTracking()
            .Where(a => a.TeacherId == teacherId)
            .Include(a => a.Course)
            .OrderBy(a => a.Course.Code)
            .Select(a => new TeacherCourseResponse
            {
                AllocationId = a.Id,
                CourseId = a.CourseId,
                CourseCode = a.Course.Code,
                CourseTitle = a.Course.Title,
                Status = a.Status.ToString()
            })
            .ToListAsync(ct);
    }

    public async Task<CourseTeacherResponse> AllocateTeacherAsync(AllocateTeacherRequest request, CancellationToken ct = default)
    {
        var teacher = await unitOfWork.Context.Users
            .SingleOrDefaultAsync(u => u.Id == request.TeacherId, ct);

        if (teacher is null || teacher.Role != UserRole.Teacher)
        {
            throw new InvalidOperationException("Allocated user must exist and have the Teacher role.");
        }

        var course = await unitOfWork.Context.Courses
            .SingleOrDefaultAsync(c => c.Id == request.CourseId, ct);

        if (course is null)
        {
            throw new InvalidOperationException($"Course with ID '{request.CourseId}' does not exist.");
        }

        var alreadyAllocated = await unitOfWork.Context.TeacherCourseAllocations
            .AnyAsync(a => a.TeacherId == request.TeacherId && a.CourseId == request.CourseId, ct);

        if (alreadyAllocated)
        {
            throw new InvalidOperationException("Teacher is already allocated to this course.");
        }

        var allocation = new TeacherCourseAllocation
        {
            Id = Guid.NewGuid(),
            TeacherId = request.TeacherId,
            CourseId = request.CourseId,
            Status = TeacherCourseAllocationStatus.Active
        };

        unitOfWork.Context.TeacherCourseAllocations.Add(allocation);
        await unitOfWork.SaveChangesAsync(ct);

        return new CourseTeacherResponse
        {
            AllocationId = allocation.Id,
            TeacherId = teacher.Id,
            TeacherName = teacher.FullName,
            TeacherEmail = teacher.Email,
            Status = allocation.Status.ToString()
        };
    }

    public async Task<bool> SetTeacherCourseAllocationStatusAsync(Guid allocationId, SetAllocationStatusRequest request, CancellationToken ct = default)
    {
        var allocation = await unitOfWork.Context.TeacherCourseAllocations
            .SingleOrDefaultAsync(a => a.Id == allocationId, ct);

        if (allocation is null)
        {
            return false;
        }

        allocation.Status = request.Status;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
