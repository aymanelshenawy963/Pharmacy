using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Mapping;

public class UserMapping : Profile
{
    public UserMapping()
    {
        CreateMap<RegisterDTO, User>();
        CreateMap<User, UserProfileDTO>();
        CreateMap<UpdateProfileDTO, User>();

        CreateMap<UserDTO, User>()
            .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => true));

        CreateMap<UpdateUserDTO, User>();

       

    }
}
