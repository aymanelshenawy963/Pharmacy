using Pharmacy.Core.Entities;

public class Basket
{
    public string Id { get; set; }

    public string PaymentIntentId { get; set; }
    public string ClientSecret { get; set; }

    public List<BasketItem> BasketItems { get; set; } = new();
}