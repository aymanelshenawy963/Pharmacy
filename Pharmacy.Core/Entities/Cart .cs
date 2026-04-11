using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class Cart : BaseEntity<string>
{
    public decimal TotalPrice { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }


    // Navigation
    public ICollection<CartItem> CartItems { get; set; } = new HashSet<CartItem>();
}