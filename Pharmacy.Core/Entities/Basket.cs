using Pharmacy.Core.Entities;

public class Basket
{
    public Basket()
    {

    }

    public Basket(string id)
    {
        Id = id;
    }
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }


    public List<BasketItem> Items { get;  set; } = new();
}