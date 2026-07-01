namespace Pharmacy.Core.DTO;

public class CreatePaymentIntentDTO
{
    public string BasketId { get; set; } = string.Empty;
    public int DeliveryMethodId { get; set; }
}
