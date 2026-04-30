
using AutoMapper;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Services;
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
    //    private readonly UserManager<User> _userManager; 
    //    private readonly IEmailService _emailService;
    //    private readonly SignInManager<AppUser> _signInManager;
    //    private readonly IGenerateToken _token;
    //    private readonly IAuthRepository _auth;


    public ICategoryRepository CategoryRepository { get; }
    public IProductRepository ProductRepository { get; }
    public IPhotoRepository PhotoRepository { get; }
    public IBasketRepository BasketRepository { get; }


    //    public IAuthRepository Auth { get; }

    public UnitOfWork(AppDbContext context, IMapper mapper,
        IImageMangementService imageMangementService , IConnectionMultiplexer redis
        //UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IEmailService emailService, IGenerateToken token, IAuthRepository auth
        )
    {
            _context = context;
            _mapper = mapper;
            _imageMangementService = imageMangementService;
            _redis = redis;
        //    _userManager = userManager;
        //    _emailService = emailService;
        //    _signInManager = signInManager;
        //    _token = token;
        //    _auth = auth;

        CategoryRepository = new CategoryRepository(_context);
        ProductRepository = new ProductRepository(_context, _mapper, _imageMangementService);
        PhotoRepository = new PhotoRepository(_context);
        BasketRepository = new BasketRepository(_redis);
        //Auth = new AuthRepository(_userManager, _emailService, _signInManager, _token, _context, _mapper);

    }
}
