using System.Collections.Generic;
using System.Threading.Tasks;
namespace backend.Repository
{
    public interface IRepository
    {
        Task<List<T>> FindAll<T>() where T : class;
        Task<T> FindById<T>(long id) where T : class;
        Task CreateAsync<T>(T entity) where T : class;
        Task UpdateAsync<T>(T entity) where T : class;
        Task DeleteAsync<T>(T entity) where T : class;

        Task<List<T>> FindPaged<T>(int page, int pageSize) where T : class;
    }
}