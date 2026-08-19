using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.CourseEnrollments;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.CourseEnrollments;

public class CourseEnrollmentService(IUnitOfWork unitOfWork) : ICourseEnrollmentService
{
    public async Task<List<CourseStudentResponse>> GetCourseStudentsAsync(Guid courseId, CancellationToken ct = default)
    {
        return await unitOfWork.CourseEnrollmentRepo.GetAll()
            .AsNoTracking()
            .Where(ce => ce.CourseId == courseId)
            .Include(ce => ce.BatchEnrollment)
                .ThenInclude(be => be.Student)
            .Include(ce => ce.BatchEnrollment)
                .ThenInclude(be => be.Batch)
            .OrderBy(ce => ce.BatchEnrollment.Student.FullName)
            .Select(ce => new CourseStudentResponse
            {
                EnrollmentId = ce.Id,
                StudentId = ce.BatchEnrollment.StudentId,
                StudentName = ce.BatchEnrollment.Student.FullName,
                StudentEmail = ce.BatchEnrollment.Student.Email,
                StudentRoll = ce.BatchEnrollment.Student.Roll,
                BatchCode = ce.BatchEnrollment.Batch.Code,
                Status = ce.Status.ToString()
            })
            .ToListAsync(ct);
    }

    public async Task<List<StudentCourseResponse>> GetStudentCoursesAsync(Guid studentId, CancellationToken ct = default)
    {
        return await unitOfWork.CourseEnrollmentRepo.GetAll()
            .AsNoTracking()
            .Where(ce => ce.BatchEnrollment.StudentId == studentId)
            .Include(ce => ce.Course)
            .OrderBy(ce => ce.Course.Code)
            .Select(ce => new StudentCourseResponse
            {
                EnrollmentId = ce.Id,
                CourseId = ce.CourseId,
                CourseCode = ce.Course.Code,
                CourseTitle = ce.Course.Title,
                Status = ce.Status.ToString()
            })
            .ToListAsync(ct);
    }

    public async Task<List<CourseStudentResponse>> EnrollStudentsAsync(EnrollStudentsRequest request, CancellationToken ct = default)
    {
        var course = await unitOfWork.CourseRepo.GetAll()
            .SingleOrDefaultAsync(c => c.Id == request.CourseId, ct);

        if (course is null)
        {
            throw new InvalidOperationException($"Course with ID '{request.CourseId}' does not exist.");
        }

        var distinctBatchEnrollmentIds = request.BatchEnrollmentIds.Distinct().ToList();

        var batchEnrollments = await unitOfWork.BatchEnrollmentRepo.GetAll()
            .Include(be => be.Student)
            .Include(be => be.Batch)
            .Where(be => distinctBatchEnrollmentIds.Contains(be.Id))
            .ToListAsync(ct);

        if (batchEnrollments.Count != distinctBatchEnrollmentIds.Count)
        {
            throw new InvalidOperationException("One or more specified batch enrollments could not be found.");
        }

        var inactiveBatchEnrollment = batchEnrollments.FirstOrDefault(be => be.Status != EnrollmentStatus.Active);
        if (inactiveBatchEnrollment is not null)
        {
            throw new InvalidOperationException($"Student '{inactiveBatchEnrollment.Student.FullName}' does not have an active batch enrollment.");
        }

        var existingEnrollments = await unitOfWork.CourseEnrollmentRepo.GetAll()
            .Where(ce => ce.CourseId == request.CourseId && distinctBatchEnrollmentIds.Contains(ce.BatchEnrollmentId))
            .ToListAsync(ct);

        var existingBatchEnrollmentIds = existingEnrollments.Select(ce => ce.BatchEnrollmentId).ToHashSet();

        var newEnrollments = new List<CourseEnrollment>();
        foreach (var batchEnrollment in batchEnrollments)
        {
            if (!existingBatchEnrollmentIds.Contains(batchEnrollment.Id))
            {
                var enrollment = new CourseEnrollment
                {
                    Id = Guid.NewGuid(),
                    BatchEnrollmentId = batchEnrollment.Id,
                    CourseId = request.CourseId,
                    Status = EnrollmentStatus.Active
                };
                newEnrollments.Add(enrollment);
                await unitOfWork.CourseEnrollmentRepo.Add(enrollment);
            }
        }

        if (newEnrollments.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(ct);
        }

        return await GetCourseStudentsAsync(request.CourseId, ct);
    }

    public async Task<bool> SetCourseEnrollmentStatusAsync(Guid enrollmentId, SetCourseEnrollmentStatusRequest request, CancellationToken ct = default)
    {
        var enrollment = await unitOfWork.CourseEnrollmentRepo.GetAll()
            .SingleOrDefaultAsync(ce => ce.Id == enrollmentId, ct);

        if (enrollment is null)
        {
            return false;
        }

        enrollment.Status = request.Status;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
