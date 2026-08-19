using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.Batches;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Batches;

public class BatchService(IUnitOfWork unitOfWork) : IBatchService
{
    public async Task<List<BatchResponse>> GetBatchesAsync(CancellationToken ct = default)
    {
        return await unitOfWork.AcademicBatchRepo.GetAll()
            .AsNoTracking()
            .Include(b => b.Term)
            .OrderBy(b => b.Code)
            .Select(b => new BatchResponse
            {
                Id = b.Id,
                TermId = b.TermId,
                TermCode = b.Term.Code,
                Code = b.Code,
                Name = b.Name
            })
            .ToListAsync(ct);
    }

    public async Task<BatchResponse?> GetBatchByIdAsync(Guid id, CancellationToken ct = default)
    {
        var batch = await unitOfWork.AcademicBatchRepo.GetAll()
            .AsNoTracking()
            .Include(b => b.Term)
            .SingleOrDefaultAsync(b => b.Id == id, ct);

        if (batch is null)
        {
            return null;
        }

        return new BatchResponse
        {
            Id = batch.Id,
            TermId = batch.TermId,
            TermCode = batch.Term.Code,
            Code = batch.Code,
            Name = batch.Name
        };
    }

    public async Task<BatchResponse> CreateBatchAsync(CreateBatchRequest request, CancellationToken ct = default)
    {
        var term = await unitOfWork.AcademicTermRepo.GetAll()
            .SingleOrDefaultAsync(t => t.Id == request.TermId, ct);

        if (term is null)
        {
            throw new InvalidOperationException($"Academic term with ID '{request.TermId}' does not exist.");
        }

        var batch = new AcademicBatch
        {
            Id = Guid.NewGuid(),
            TermId = request.TermId,
            Code = request.Code.Trim(),
            Name = request.Name.Trim()
        };

        await unitOfWork.AcademicBatchRepo.Add(batch);
        await unitOfWork.SaveChangesAsync(ct);

        return new BatchResponse
        {
            Id = batch.Id,
            TermId = batch.TermId,
            TermCode = term.Code,
            Code = batch.Code,
            Name = batch.Name
        };
    }

    public async Task<BatchResponse?> UpdateBatchAsync(Guid id, UpdateBatchRequest request, CancellationToken ct = default)
    {
        var batch = await unitOfWork.AcademicBatchRepo.GetAll()
            .Include(b => b.Term)
            .SingleOrDefaultAsync(b => b.Id == id, ct);

        if (batch is null)
        {
            return null;
        }

        batch.Code = request.Code.Trim();
        batch.Name = request.Name.Trim();

        await unitOfWork.SaveChangesAsync(ct);

        return new BatchResponse
        {
            Id = batch.Id,
            TermId = batch.TermId,
            TermCode = batch.Term.Code,
            Code = batch.Code,
            Name = batch.Name
        };
    }

    public async Task<bool> DeleteBatchAsync(Guid id, CancellationToken ct = default)
    {
        var batch = await unitOfWork.AcademicBatchRepo.GetAll()
            .SingleOrDefaultAsync(b => b.Id == id, ct);

        if (batch is null)
        {
            return false;
        }

        var hasEnrollments = await unitOfWork.BatchEnrollmentRepo.GetAll()
            .AnyAsync(e => e.BatchId == id, ct);

        if (hasEnrollments)
        {
            throw new InvalidOperationException("Cannot delete batch because student enrollments exist.");
        }

        unitOfWork.AcademicBatchRepo.Delete(batch);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<BatchStudentResponse>> GetBatchStudentsAsync(Guid batchId, CancellationToken ct = default)
    {
        return await unitOfWork.BatchEnrollmentRepo.GetAll()
            .AsNoTracking()
            .Where(e => e.BatchId == batchId)
            .Include(e => e.Student)
            .OrderBy(e => e.Student.FullName)
            .Select(e => new BatchStudentResponse
            {
                EnrollmentId = e.Id,
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                StudentEmail = e.Student.Email,
                StudentRoll = e.Student.Roll,
                Status = e.Status.ToString()
            })
            .ToListAsync(ct);
    }

    public async Task<BatchStudentResponse> AssignStudentAsync(Guid batchId, AssignStudentRequest request, CancellationToken ct = default)
    {
        var batch = await unitOfWork.AcademicBatchRepo.GetAll()
            .SingleOrDefaultAsync(b => b.Id == batchId, ct);

        if (batch is null)
        {
            throw new InvalidOperationException($"Batch with ID '{batchId}' was not found.");
        }

        var student = await unitOfWork.UserRepo.GetAll()
            .SingleOrDefaultAsync(u => u.Id == request.StudentId, ct);

        if (student is null || student.Role != UserRole.Student)
        {
            throw new InvalidOperationException("Assigned user must exist and have the Student role.");
        }

        // Check if student already enrolled in this exact batch
        var alreadyInBatch = await unitOfWork.BatchEnrollmentRepo.GetAll()
            .AnyAsync(e => e.BatchId == batchId && e.StudentId == request.StudentId, ct);

        if (alreadyInBatch)
        {
            throw new InvalidOperationException("Student is already assigned to this batch.");
        }

        // Check if student already has an active enrollment in this term
        var hasActiveInTerm = await unitOfWork.BatchEnrollmentRepo.GetAll()
            .AnyAsync(e => e.StudentId == request.StudentId
                           && e.Batch.TermId == batch.TermId
                           && e.Status == EnrollmentStatus.Active, ct);

        if (hasActiveInTerm)
        {
            throw new InvalidOperationException("Student already has an active batch enrollment in this academic term.");
        }

        var enrollment = new BatchEnrollment
        {
            Id = Guid.NewGuid(),
            BatchId = batchId,
            StudentId = request.StudentId,
            Status = EnrollmentStatus.Active
        };

        await unitOfWork.BatchEnrollmentRepo.Add(enrollment);
        await unitOfWork.SaveChangesAsync(ct);

        return new BatchStudentResponse
        {
            EnrollmentId = enrollment.Id,
            StudentId = student.Id,
            StudentName = student.FullName,
            StudentEmail = student.Email,
            StudentRoll = student.Roll,
            Status = enrollment.Status.ToString()
        };
    }

    public async Task<bool> SetBatchEnrollmentStatusAsync(Guid enrollmentId, SetBatchEnrollmentStatusRequest request, CancellationToken ct = default)
    {
        var enrollment = await unitOfWork.BatchEnrollmentRepo.GetAll()
            .Include(e => e.Batch)
            .SingleOrDefaultAsync(e => e.Id == enrollmentId, ct);

        if (enrollment is null)
        {
            return false;
        }

        if (request.Status == EnrollmentStatus.Active && enrollment.Status != EnrollmentStatus.Active)
        {
            var hasActiveInTerm = await unitOfWork.BatchEnrollmentRepo.GetAll()
                .AnyAsync(e => e.Id != enrollmentId
                               && e.StudentId == enrollment.StudentId
                               && e.Batch.TermId == enrollment.Batch.TermId
                               && e.Status == EnrollmentStatus.Active, ct);

            if (hasActiveInTerm)
            {
                throw new InvalidOperationException("Student already has an active batch enrollment in this academic term.");
            }
        }

        enrollment.Status = request.Status;
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
