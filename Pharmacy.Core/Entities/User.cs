using Microsoft.AspNetCore.Identity;
using Pharmacy.Core.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class User : IdentityUser
{
    public string DisplayName { get; set; }
    public Address Address { get; set; }

    public UserRole Role { get; set; } = UserRole.User;

    public bool IsActive { get; set; } = true;


}