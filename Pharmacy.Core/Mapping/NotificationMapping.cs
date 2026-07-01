using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Mapping;

public class NotificationMapping : Profile
{
    public NotificationMapping()
    {
        CreateMap<Notification, NotificationDTO>();
    }
}
