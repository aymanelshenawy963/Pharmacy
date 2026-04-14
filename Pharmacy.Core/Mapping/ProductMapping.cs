
using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Mapping;


public class ProductMapping : Profile
{
    public ProductMapping()
    {
        // Mapping from Product to ProductToReturnDto
        CreateMap<Product, ProductToReturnDTO>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
            .ForMember(d => d.Images, o => o.MapFrom(s => s.Photos.Select(p => p.ImageName)));

        // Reverse mapping for ProductDto to Product
        CreateMap<ProductDTO, Product>();

    }
}
