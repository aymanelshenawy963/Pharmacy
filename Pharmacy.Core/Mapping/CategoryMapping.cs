using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Mapping;

public class CategoryMapping : Profile
{
    public CategoryMapping()
    {
        CreateMap<Category, CategoryToReturnDTO>();
        CreateMap<CategoryDTO, Category>();
    }
}
