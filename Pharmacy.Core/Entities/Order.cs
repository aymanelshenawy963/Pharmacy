using Pharmacy.Core.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;


public class Order : BaseEntity<string>
{


    public decimal TotalPrice { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public string Address { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }
    // Navigation
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}