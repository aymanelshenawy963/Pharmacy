using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Core.Settings;
using Pharmacy.Infrastructure.Data;
using Stripe;

namespace Pharmacy.Infrastructure.Repositories.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly AppDbContext _context;

    public PaymentService(IUnitOfWork unitOfWork, AppDbContext context, IOptions<StripeSettings> stripeOptions)
    {
        _unitOfWork = unitOfWork;
        _context    = context;
        StripeConfiguration.ApiKey = stripeOptions.Value.SecretKey;
    }

    public async Task<(Basket? Basket, string? Error)> CreateOrUpdatePaymentIntentAsync(
        string basketId, int deliveryMethodId)
    {
        var basket = await _unitOfWork.BasketRepository.GetBasketAsync(basketId);
        if (basket is null || basket.Items.Count == 0)
            return (null, "Basket is empty or not found");

        var deliveryMethod = await _context.DeliveryMethods.FindAsync(deliveryMethodId);
        if (deliveryMethod is null)
            return (null, "Delivery method not found");

        // Always calculate from DB prices — never trust basket item prices
        decimal subTotal = 0;
        foreach (var item in basket.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product is null)
                return (null, $"Product {item.ProductId} not found");

            subTotal += product.NewPrice * item.Quantity;
        }

        var amountInCents = (long)((subTotal + deliveryMethod.Price) * 100);

        var intentService = new PaymentIntentService();
        PaymentIntent intent;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var createOptions = new PaymentIntentCreateOptions
            {
                Amount             = amountInCents,
                Currency           = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await intentService.CreateAsync(createOptions);
        }
        else
        {
            var updateOptions = new PaymentIntentUpdateOptions
            {
                Amount = amountInCents
            };
            intent = await intentService.UpdateAsync(basket.PaymentIntentId, updateOptions);
        }

        basket.PaymentIntentId  = intent.Id;
        basket.ClientSecret     = intent.ClientSecret;
        basket.DeliveryMethodId = deliveryMethodId;

        var updatedBasket = await _unitOfWork.BasketRepository.UpdateBasketAsync(basket);
        return (updatedBasket, null);
    }

    public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId)
            ?? throw new KeyNotFoundException(
                $"No order found for PaymentIntent '{paymentIntentId}'.");

        order.Status = OrderStatus.Paid;
        await _unitOfWork.SaveAsync();
        return order;
    }

    public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId)
            ?? throw new KeyNotFoundException(
                $"No order found for PaymentIntent '{paymentIntentId}'.");

        order.Status = OrderStatus.PaymentFailed;
        await _unitOfWork.SaveAsync();
        return order;
    }

    public async Task<string?> GetPaymentIntentStatusAsync(string paymentIntentId)
    {
        if (string.IsNullOrEmpty(paymentIntentId))
            return null;

        var intentService = new PaymentIntentService();
        try
        {
            var intent = await intentService.GetAsync(paymentIntentId);
            return intent.Status;
        }
        catch (StripeException)
        {
            return null;
        }
    }
}
