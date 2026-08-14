using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.AcademicTerms;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.AcademicTerms;

public class AcademicTermService(IUnitOfWork unitOfWork) : IAcademicTermService
{
    public async Task<List<AcademicTermResponse>> GetAcademicTermsAsync(CancellationToken ct = default)
    {
        return await unitOfWork.Context.AcademicTerms
            .AsNoTracking()
            .OrderByDescending(t => t.StartsOn)
            .Select(t => new AcademicTermResponse
            {
                Id = t.Id,
                Code = t.Code,
                StartsOn = t.StartsOn,
                EndsOn = t.EndsOn
            })
            .ToListAsync(ct);
    }

    public async Task<AcademicTermResponse?> GetAcademicTermByIdAsync(Guid id, CancellationToken ct = default)
    {
        var term = await unitOfWork.Context.AcademicTerms
            .AsNoTracking()
            .SingleOrDefaultAsync(t => t.Id == id, ct);

        if (term is null)
        {
            return null;
        }

        return new AcademicTermResponse
        {
            Id = term.Id,
            Code = term.Code,
            StartsOn = term.StartsOn,
            EndsOn = term.EndsOn
        };
    }

    public async Task<AcademicTermResponse> CreateAcademicTermAsync(CreateAcademicTermRequest request, CancellationToken ct = default)
    {
        if (request.StartsOn > request.EndsOn)
        {
            throw new InvalidOperationException("Term start date cannot be after end date.");
        }

        var normalizedCode = request.Code.Trim().ToUpperInvariant();
        var codeExists = await unitOfWork.Context.AcademicTerms
            .AnyAsync(t => t.Code.ToUpper() == normalizedCode, ct);

        if (codeExists)
        {
            throw new InvalidOperationException($"Academic term with code '{request.Code}' already exists.");
        }

        var term = new AcademicTerm
        {
            Id = Guid.NewGuid(),
            Code = normalizedCode,
            StartsOn = request.StartsOn,
            EndsOn = request.EndsOn
        };

        unitOfWork.Context.AcademicTerms.Add(term);
        await unitOfWork.SaveChangesAsync(ct);

        return new AcademicTermResponse
        {
            Id = term.Id,
            Code = term.Code,
            StartsOn = term.StartsOn,
            EndsOn = term.EndsOn
        };
    }

    public async Task<AcademicTermResponse?> UpdateAcademicTermAsync(Guid id, UpdateAcademicTermRequest request, CancellationToken ct = default)
    {
        if (request.StartsOn > request.EndsOn)
        {
            throw new InvalidOperationException("Term start date cannot be after end date.");
        }

        var term = await unitOfWork.Context.AcademicTerms
            .SingleOrDefaultAsync(t => t.Id == id, ct);

        if (term is null)
        {
            return null;
        }

        var normalizedCode = request.Code.Trim().ToUpperInvariant();
        if (term.Code.ToUpper() != normalizedCode)
        {
            var codeExists = await unitOfWork.Context.AcademicTerms
                .AnyAsync(t => t.Id != id && t.Code.ToUpper() == normalizedCode, ct);

            if (codeExists)
            {
                throw new InvalidOperationException($"Academic term with code '{request.Code}' already exists.");
            }

            term.Code = normalizedCode;
        }

        term.StartsOn = request.StartsOn;
        term.EndsOn = request.EndsOn;

        await unitOfWork.SaveChangesAsync(ct);

        return new AcademicTermResponse
        {
            Id = term.Id,
            Code = term.Code,
            StartsOn = term.StartsOn,
            EndsOn = term.EndsOn
        };
    }

    public async Task<bool> DeleteAcademicTermAsync(Guid id, CancellationToken ct = default)
    {
        var term = await unitOfWork.Context.AcademicTerms
            .SingleOrDefaultAsync(t => t.Id == id, ct);

        if (term is null)
        {
            return false;
        }

        var hasBatches = await unitOfWork.Context.AcademicBatches
            .AnyAsync(b => b.TermId == id, ct);

        if (hasBatches)
        {
            throw new InvalidOperationException("Cannot delete academic term because batches reference it.");
        }

        unitOfWork.Context.AcademicTerms.Remove(term);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
