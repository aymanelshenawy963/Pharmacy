using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class DeliveryMethod : BaseEntity<int>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string DeliveryTime { get; set; }
}