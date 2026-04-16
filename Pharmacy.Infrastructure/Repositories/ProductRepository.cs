using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Services;
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


    public async Task<ProductToReturnDTO> AddAsync(ProductDTO productDTO)
    {
        var product = _mapper.Map<Product>(productDTO);

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        // 🟢 رفع الصور
        var imagePaths = await _imageMangementService
            .AddImageAsync(productDTO.Photos, productDTO.Name);

        var photos = imagePaths.Select(path => new Photo
        {
            ImageName = path,
            ProductId = product.Id
        }).ToList();

        await _context.Photos.AddRangeAsync(photos);
        await _context.SaveChangesAsync();

        // 🟢 رجّع المنتج بالـ includes
        var productWithIncludes = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(p => p.Id == product.Id);

        // 🟢 mapping
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
        foreach (var photo in product.Photos)
        {
            _imageMangementService.DeleteImage(photo.ImageName);
        }

        // 🟢 حذف من DB
        _context.Photos.RemoveRange(product.Photos);

        // 🟢 رفع الصور الجديدة
        var imagePaths = await _imageMangementService
            .AddImageAsync(productDTO.Photos, productDTO.Name);

        var newPhotos = imagePaths.Select(path => new Photo
        {
            ImageName = path,
            ProductId = product.Id
        }).ToList();

        await _context.Photos.AddRangeAsync(newPhotos);

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
