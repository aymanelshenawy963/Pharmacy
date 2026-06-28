using Pharmacy.Core.Interfaces;

namespace Pharmacy.Core.interfaces;

public interface IUnitOfWork
{
    ICategoryRepository CategoryRepository { get; }
    IProductRepository ProductRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    IBasketRepository BasketRepository { get; }
    IOrderRepository OrderRepository { get; }

    /// <summary>
    /// Persists all staged changes in a single database transaction.
    /// Returns the number of state entries written.
    /// </summary>
    Task<int> SaveAsync();
}
