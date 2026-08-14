using OnnoRokomBackend.DbContext;

namespace OnnoRokomBackend.UnitOfWork;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    public AppDbContext Context => context;

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => context.SaveChangesAsync(ct);
}
