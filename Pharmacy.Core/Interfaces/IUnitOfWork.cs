using Pharmacy.Core.Interfaces;

namespace Pharmacy.Core.interfaces;

public interface IUnitOfWork
{
    public ICategoryRepository CategoryRepository { get; }
    public IProductRepository ProductRepository { get; }
    public IPhotoRepository PhotoRepository { get; }
    //public IBasketRepository CustomerBasket { get; }
    //public IAuthRepository Auth { get; }

}
