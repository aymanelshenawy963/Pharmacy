using AutoMapper;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Mapping;

public class RoleMapping : Profile
{
        public RoleMapping()
        {
        // Add role mapping configurations here if needed
         CreateMap<ApplicationRole, RoleToReturnDTO>().ReverseMap();
         CreateMap<ApplicationRole, RoleDTO>().ReverseMap();
    }
}
