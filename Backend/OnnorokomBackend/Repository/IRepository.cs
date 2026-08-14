namespace OnnoRokomBackend.Repository;

public interface IRepository<TEntity> where TEntity : class
{
    Task<TEntity> Get(string id);
    IQueryable<TEntity> GetAll();
    Task Update(TEntity entity);
    Task Delete(string id);
    Task Add(TEntity entity);
}
