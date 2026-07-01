using AutoMapper;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Infrastructure.Data;
using Pharmacy.Infrastructure.Repositories;
using StackExchange.Redis;

namespace Pharmacy.Infrastructure.Repositriers;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IImageMangementService _imageMangementService;
    private readonly IConnectionMultiplexer _redis;

    public ICategoryRepository CategoryRepository { get; }
    public IProductRepository ProductRepository { get; }
    public IPhotoRepository PhotoRepository { get; }
    public IBasketRepository BasketRepository { get; }
    public IOrderRepository OrderRepository { get; }
    public INotificationRepository NotificationRepository { get; }

    public UnitOfWork(AppDbContext context, IMapper mapper,
        IImageMangementService imageMangementService, IConnectionMultiplexer redis)
    {
        _context = context;
        _mapper = mapper;
        _imageMangementService = imageMangementService;
        _redis = redis;

        CategoryRepository = new CategoryRepository(_context);
        ProductRepository = new ProductRepository(_context, _mapper, _imageMangementService);
        PhotoRepository = new PhotoRepository(_context);
        BasketRepository = new BasketRepository(_redis);
        OrderRepository = new OrderRepository(_context);
        NotificationRepository = new NotificationRepository(_context);
    }

    public Task<int> SaveAsync() => _context.SaveChangesAsync();
}
