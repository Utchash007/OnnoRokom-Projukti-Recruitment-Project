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

    public async Task<TEntity> Get(string id)
    {
        return await _context.Set<TEntity>().FindAsync(id);
    }

    public async Task Add(TEntity entity)
    {
        await _context.Set<TEntity>().AddAsync(entity);
    }

    public async Task Delete(string id)
    {
        var entity = await Get(id);
        if (entity is null)
        {
            return;
        }

        _context.Set<TEntity>().Remove(entity);
        
    }

    public async Task Update(TEntity entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await Task.CompletedTask;
    }

    public IQueryable<TEntity> GetAll()
    {
        return _context.Set<TEntity>().AsQueryable();
    }
}
