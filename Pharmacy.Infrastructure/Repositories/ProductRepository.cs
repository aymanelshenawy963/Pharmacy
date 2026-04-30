using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Services;
using Pharmacy.Core.Sharing;
using Pharmacy.Infrastructure.Data;


namespace Pharmacy.Infrastructure.Repositories;

public class ProductRepository : GenericRepositry<Product>, IProductRepository
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IImageMangementService _imageMangementService;
    public ProductRepository(AppDbContext context, IMapper mapper, IImageMangementService imageMangementService) : base(context)
    {
        _context = context;
        _mapper = mapper;
        _imageMangementService = imageMangementService;
    }


    public async Task<ProductsToReturnDTO> GetAllAsync(ProductParams productParams)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .AsNoTracking();

        //filtering by word in name or description
        if (!string.IsNullOrEmpty(productParams.Search))
        {
            var searchWords = productParams.Search.Split(' ');
            foreach (var word in searchWords)
            {
                var temp = word.Trim().ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(temp) || x.Description.ToLower().Contains(temp));
            }
        }

        //filtering by category Id
        if (productParams.CategoryId.HasValue) 
            query = query.Where(x=>x.CategoryId == productParams.CategoryId);

        if (!string.IsNullOrEmpty(productParams.Sort))
        {
            query = productParams.Sort.ToLower() switch
            {
                "priceasc" => query.OrderBy(p => p.NewPrice),
                "pricedesc" => query.OrderByDescending(p => p.NewPrice),
                "nameasc" => query.OrderBy(p => p.Name),
                "namedesc" => query.OrderByDescending(p => p.Name),
                _ => query
            };
        }

        ProductsToReturnDTO productsToReturnDTO = new ProductsToReturnDTO
        {
            TotalCount = await query.CountAsync()
        };


        query = query.Skip((productParams.PageNumber - 1) * productParams.PageSize)
                     .Take(productParams.PageSize);

        var products = await query.ToListAsync();

        productsToReturnDTO.Products = _mapper.Map<List<ProductToReturnDTO>>(products);

        return productsToReturnDTO;
    }

    public async Task<ProductToReturnDTO> AddAsync(ProductDTO productDTO)
    {
        var product = _mapper.Map<Product>(productDTO);

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        // 🟢 رفع الصور
        if (productDTO.Photos != null && productDTO.Photos.Count > 0)
        {
            var imagePaths = await _imageMangementService
                .AddImageAsync(productDTO.Photos, productDTO.Name);

            var photos = imagePaths.Select(path => new Photo
            {
                ImageName = path,
                ProductId = product.Id
            }).ToList();

            await _context.Photos.AddRangeAsync(photos);
            await _context.SaveChangesAsync();
        }

        var productWithIncludes = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(p => p.Id == product.Id);

        return _mapper.Map<ProductToReturnDTO>(productWithIncludes);
    }


    public async Task<bool> UpdateAsync(int id, ProductDTO productDTO)
    {
        if (productDTO is null) return false;

        var product = await _context.Products
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return false;

        // 🟢 update basic data
        _mapper.Map(productDTO, product);

        // 🟢 حذف الصور القديمة من السيرفر
        if (product.Photos != null && product.Photos.Any())
        {
            foreach (var photo in product.Photos)
            {
                _imageMangementService.DeleteImage(photo.ImageName);
            }

            _context.Photos.RemoveRange(product.Photos);
        }

        // 🟢 رفع الصور الجديدة
        if (productDTO.Photos != null && productDTO.Photos.Count > 0)
        {
            var imagePaths = await _imageMangementService
                .AddImageAsync(productDTO.Photos, productDTO.Name);

            var newPhotos = imagePaths.Select(path => new Photo
            {
                ImageName = path,
                ProductId = product.Id
            }).ToList();

            await _context.Photos.AddRangeAsync(newPhotos);
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Product product)
    {
        var photos = await _context.Photos.Where(p => p.ProductId == product.Id).ToListAsync();
        foreach (var photo in photos)
        {
            _imageMangementService.DeleteImage(photo.ImageName);
        }

         _context.Products.Remove(product);
         await _context.SaveChangesAsync();
        return true;
    }


}
