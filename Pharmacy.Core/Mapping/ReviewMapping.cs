using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Mapping;

public class ReviewMapping : Profile
{
    public ReviewMapping()
    {
        CreateMap<Review, ReviewDTO>()
            .ForMember(d => d.ReviewerName, o => o.MapFrom(s => s.Reviewer.FirstName));
    }
}
