using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Interfaces.Services;

public interface IPaymentService
{
    Task<(Basket? Basket, string? Error)> CreateOrUpdatePaymentIntentAsync(string basketId, int deliveryMethodId);
    Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);
    Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);
}
