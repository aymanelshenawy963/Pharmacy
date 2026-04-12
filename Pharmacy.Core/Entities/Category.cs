using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class Category : BaseEntity<int>
{
    public string Name { get; set; }
    public string Description { get; set; }

    // Navigation
    public ICollection<Product> Products { get; set; } = new HashSet<Product>();
}
