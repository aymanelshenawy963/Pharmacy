using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class CartItem : BaseEntity<string>
{
    public int Quantity { get; set; }
    public decimal Price { get; set; }

    public string CartId { get; set; }
    public Cart Cart { get; set; }
    public string ProductId { get; set; }
    public Product Product { get; set; }
}
