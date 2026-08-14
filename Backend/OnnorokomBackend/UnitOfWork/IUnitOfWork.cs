using OnnoRokomBackend.DbContext;

namespace OnnoRokomBackend.UnitOfWork;

public interface IUnitOfWork
{
    AppDbContext Context { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
