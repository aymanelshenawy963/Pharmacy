using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Mapping;

public class OrderMapping : Profile
{
    public OrderMapping()
    {
        CreateMap<Order, OrderToReturnDTO>()
            .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.Name))
            .ForMember(d => d.DeliveryPrice,  o => o.MapFrom(s => s.DeliveryMethod.Price))
            .ForMember(d => d.Total,          o => o.MapFrom(s => s.GetTotal()))
            .ForMember(d => d.Status,         o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<OrderItem, OrderItemDTO>();

        CreateMap<ShippingAddress, ShippingAddressDTO>().ReverseMap();
    }
}
