using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.DTO;

// ── Input DTOs ──────────────────────────────────────────────────────────────

public class CreateOrderDTO
{
    public string BasketId { get; set; }
    public int DeliveryMethodId { get; set; }
    public ShippingAddressDTO ShippingAddress { get; set; }
}

public class UpdateOrderStatusDTO
{
    public OrderStatus Status { get; set; }
}

// ── Response DTOs ────────────────────────────────────────────────────────────

public class ShippingAddressDTO
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
}

public class OrderItemDTO
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string MainImage { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class OrderToReturnDTO
{
    public int Id { get; set; }
    public string BuyerEmail { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public decimal SubTotal { get; set; }
    public decimal DeliveryPrice { get; set; }
    public decimal Total { get; set; }
    public string DeliveryMethod { get; set; }
    public ShippingAddressDTO ShippingAddress { get; set; }
    public List<OrderItemDTO> OrderItems { get; set; }
}
