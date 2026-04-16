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
            .ForMember(dis => dis.CategoryName, o => o.MapFrom(src => src.Category.Name))
            .ForMember(d => d.Photos, o => o.MapFrom(s => s.Photos.Select(p => p.ImageName)));

        // Reverse mapping for ProductDto to Product
        CreateMap<ProductDTO, Product>()
            .ForMember(d=>d.Photos,op=>op.Ignore());

    }
}
