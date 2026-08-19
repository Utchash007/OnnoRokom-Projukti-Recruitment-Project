using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.DbContext;

namespace OnnoRokomBackend.Repository;

public class EFRepository<TEntity> : IRepository<TEntity> where TEntity : class
{
    private readonly AppDbContext _context;

    public EFRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TEntity?> Get(Guid id)
    {
        return await _context.Set<TEntity>().FindAsync(id);
    }

    public async Task Add(TEntity entity)
    {
        await _context.Set<TEntity>().AddAsync(entity);
    }

    public void Delete(TEntity entity)
    {
        _context.Set<TEntity>().Remove(entity);
    }

    public void Update(TEntity entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
    }

    public IQueryable<TEntity> GetAll()
    {
        return _context.Set<TEntity>().AsQueryable();
    }
}
