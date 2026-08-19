using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.Courses;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Courses;

public class CourseService(IUnitOfWork unitOfWork) : ICourseService
{
    public async Task<List<CourseResponse>> GetCoursesAsync(CancellationToken ct = default)
    {
        return await unitOfWork.CourseRepo.GetAll()
            .AsNoTracking()
            .OrderBy(c => c.Code)
            .Select(c => new CourseResponse
            {
                Id = c.Id,
                Code = c.Code,
                Title = c.Title,
                Description = c.Description
            })
            .ToListAsync(ct);
    }

    public async Task<CourseResponse?> GetCourseByIdAsync(Guid id, CancellationToken ct = default)
    {
        var course = await unitOfWork.CourseRepo.GetAll()
            .AsNoTracking()
            .SingleOrDefaultAsync(c => c.Id == id, ct);

        if (course is null)
        {
            return null;
        }

        return new CourseResponse
        {
            Id = course.Id,
            Code = course.Code,
            Title = course.Title,
            Description = course.Description
        };
    }

    public async Task<CourseResponse> CreateCourseAsync(CreateCourseRequest request, CancellationToken ct = default)
    {
        var normalizedCode = request.Code.Trim().ToUpperInvariant();
        var codeExists = await unitOfWork.CourseRepo.GetAll()
            .AnyAsync(c => c.Code.ToUpper() == normalizedCode, ct);

        if (codeExists)
        {
            throw new InvalidOperationException($"Course with code '{request.Code}' already exists.");
        }

        var course = new Course
        {
            Id = Guid.NewGuid(),
            Code = normalizedCode,
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim()
        };

        await unitOfWork.CourseRepo.Add(course);
        await unitOfWork.SaveChangesAsync(ct);

        return new CourseResponse
        {
            Id = course.Id,
            Code = course.Code,
            Title = course.Title,
            Description = course.Description
        };
    }

    public async Task<CourseResponse?> UpdateCourseAsync(Guid id, UpdateCourseRequest request, CancellationToken ct = default)
    {
        var course = await unitOfWork.CourseRepo.GetAll()
            .SingleOrDefaultAsync(c => c.Id == id, ct);

        if (course is null)
        {
            return null;
        }

        var normalizedCode = request.Code.Trim().ToUpperInvariant();
        if (course.Code.ToUpper() != normalizedCode)
        {
            var codeExists = await unitOfWork.CourseRepo.GetAll()
                .AnyAsync(c => c.Id != id && c.Code.ToUpper() == normalizedCode, ct);

            if (codeExists)
            {
                throw new InvalidOperationException($"Course with code '{request.Code}' already exists.");
            }

            course.Code = normalizedCode;
        }

        course.Title = request.Title.Trim();
        course.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

        await unitOfWork.SaveChangesAsync(ct);

        return new CourseResponse
        {
            Id = course.Id,
            Code = course.Code,
            Title = course.Title,
            Description = course.Description
        };
    }

    public async Task<bool> DeleteCourseAsync(Guid id, CancellationToken ct = default)
    {
        var course = await unitOfWork.CourseRepo.GetAll()
            .SingleOrDefaultAsync(c => c.Id == id, ct);

        if (course is null)
        {
            return false;
        }

        var hasAllocations = await unitOfWork.TeacherCourseAllocationRepo.GetAll().AnyAsync(a => a.CourseId == id, ct);
        var hasEnrollments = await unitOfWork.CourseEnrollmentRepo.GetAll().AnyAsync(e => e.CourseId == id, ct);
        var hasAssignments = await unitOfWork.AssignmentRepo.GetAll().IgnoreQueryFilters().AnyAsync(a => a.CourseId == id, ct);

        if (hasAllocations || hasEnrollments || hasAssignments)
        {
            throw new InvalidOperationException("Cannot delete course because teacher allocations, student enrollments, or assignments exist.");
        }

        unitOfWork.CourseRepo.Delete(course);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
