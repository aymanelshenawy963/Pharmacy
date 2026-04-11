using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class Product : BaseEntity<string>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    public string Image { get; set; }
    public int Stock { get; set; }

    public bool RequiresPrescription { get; set; }
    public bool HasStrips { get; set; }
    public int? StripCount { get; set; }

    public bool TopSelling { get; set; }


    public string CategoryId { get; set; }
    public Category Category { get; set; }
    // Navigation
    public ICollection<CartItem> CartItems { get; set; } = new HashSet<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}