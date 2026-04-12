using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Order : BaseEntity<int>
{
    public Order() { }

    public Order(string buyerEmail, decimal subTotal, ShippingAddress shippingAddress,
        DeliveryMethod deliveryMethod, IReadOnlyList<OrderItem> orderItems, string paymentIntentId)
    {
        BuyerEmail = buyerEmail;
        SubTotal = subTotal;
        ShippingAddress = shippingAddress;
        DeliveryMethod = deliveryMethod;
        OrderItems = orderItems.ToList();
        PaymentIntentId = paymentIntentId;
    }

    public string BuyerEmail { get; set; }
    public decimal SubTotal { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.Now;

    public ShippingAddress ShippingAddress { get; set; }

    public string PaymentIntentId { get; set; }

    public int DeliveryMethodId { get; set; }
    public DeliveryMethod DeliveryMethod { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public decimal GetTotal() => SubTotal + DeliveryMethod.Price;
}