namespace Pharmacy.Core.Interfaces.Services;

public interface IPaymentService
{
    Task<(Basket? Basket, string? Error)> CreateOrUpdatePaymentIntentAsync(string basketId, int deliveryMethodId);
}
