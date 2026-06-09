
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Infrastructure.Data;
using Pharmacy.Infrastructure.Repositories;
using Pharmacy.Infrastructure.Repositories.Services;
using StackExchange.Redis;



namespace Pharmacy.Infrastructure.Repositriers;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IImageMangementService _imageMangementService;
    private readonly IConnectionMultiplexer _redis;
    private readonly IAuthService _auth;
    //private readonly UserManager<User> _userManager; 
    //private readonly SignInManager<User> _signInManager;
    //private readonly IEmailService _emailService;


    public ICategoryRepository CategoryRepository { get; }
    public IProductRepository ProductRepository { get; }
    public IPhotoRepository PhotoRepository { get; }
    public IBasketRepository BasketRepository { get; }


    public UnitOfWork(AppDbContext context, IMapper mapper,
        IImageMangementService imageMangementService , IConnectionMultiplexer redis, IAuthService auth
       // ,UserManager<User> userManager, SignInManager<User> signInManager IEmailService emailService,  
        )
    {
            _context = context;
            _mapper = mapper;
            _imageMangementService = imageMangementService;
            _redis = redis;
            _auth = auth;
            //_userManager = userManager;
            //_signInManager = signInManager;
           //_emailService = emailService;


        CategoryRepository = new CategoryRepository(_context);
        ProductRepository = new ProductRepository(_context, _mapper, _imageMangementService);
        PhotoRepository = new PhotoRepository(_context);
        BasketRepository = new BasketRepository(_redis);

    }
}
