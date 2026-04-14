//using AutoMapper;
//using Ecom.Core.DTO;
//using Ecom.Core.Entites;
//using Ecom.Core.Entites.Order;

namespace Pharmacy.Core.Mapping;


//public class OrderMapping:Profile
//{
//    public OrderMapping()
//    {
//        CreateMap<Orders, OrderToReturnDTO>()
//            .ForMember(d=>d.DeliveryMethod,o=>o.MapFrom(s=>s.DeliveryMethod.Name))
//            .ReverseMap();

//        CreateMap<OrderItem, OrderItemDTO>().ReverseMap();
//        CreateMap<ShippingAddress, ShippAddressDTO>().ReverseMap();
//        CreateMap<Address, ShippAddressDTO>().ReverseMap();

//        CreateMap<Address, Address>()
//            .ForMember(dest => dest.Id, opt => opt.Ignore())
//            .ForMember(dest => dest.AppUserId, opt => opt.Ignore())
//            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));


//    }
//}
