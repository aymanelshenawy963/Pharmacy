using Pharmacy.Core.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class User : BaseEntity<string>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public UserRole Role { get; set; } = UserRole.User;

    public bool IsActive { get; set; } = true;

    // Navigation
    public Cart Cart { get; set; }
    public ICollection<Order> Orders { get; set; } = new HashSet<Order>();
}