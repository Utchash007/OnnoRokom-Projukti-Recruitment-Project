namespace OnnoRokomBackend.Repository;

public interface IRepository<TEntity> where TEntity : class
{
    Task<TEntity?> Get(Guid id);
    IQueryable<TEntity> GetAll();
    void Update(TEntity entity);
    void Delete(TEntity entity);
    Task Add(TEntity entity);
}
