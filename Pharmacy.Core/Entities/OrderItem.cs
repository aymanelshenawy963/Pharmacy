using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class OrderItem : BaseEntity<int>
{
    public OrderItem() { }

    public OrderItem(int productId, string mainImage, string productName, decimal price, int quantity)
    {
        ProductId = productId;
        MainImage = mainImage;
        ProductName = productName;
        Price = price;
        Quantity = quantity;
    }

    public int ProductId { get; set; }
    public string MainImage { get; set; }
    public string ProductName { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; }
}