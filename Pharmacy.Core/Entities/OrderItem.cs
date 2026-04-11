using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class OrderItem : BaseEntity<string>
{
    public int Quantity { get; set; }
    public decimal Price { get; set; }


    public string OrderId { get; set; }
    public Order Order { get; set; }

    public string ProductId { get; set; }
    public Product Product { get; set; }


}
