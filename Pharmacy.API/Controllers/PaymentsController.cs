using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pharmacy.API.Helpers;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Core.Settings;
using Stripe;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = DefaultRoles.Customer)]
public class PaymentsController(
    IPaymentService paymentService,
    IOptions<StripeSettings> stripeOptions,
    ILogger<PaymentsController> logger) : ControllerBase
{
    private readonly IPaymentService _paymentService = paymentService;
    private readonly string _webhookSecret = stripeOptions.Value.WebhookSecret;
    private readonly ILogger<PaymentsController> _logger = logger;

    /// <summary>POST /api/payments — Create or update a Stripe PaymentIntent for the given basket.</summary>
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdatePaymentIntent([FromBody] CreatePaymentIntentDTO dto)
    {
        var (basket, error) = await _paymentService.CreateOrUpdatePaymentIntentAsync(
            dto.BasketId, dto.DeliveryMethodId);

        if (error is not null)
            return BadRequest(new ResponseAPI(400, error));

        return Ok(basket);
    }

    /// <summary>
    /// POST /api/payments/webhook — Stripe sends signed events here.
    /// Returns 200 immediately to acknowledge receipt; order status is updated asynchronously.
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"];

        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, _webhookSecret);
        }
        catch (StripeException ex)
        {
            _logger.LogWarning("Stripe webhook signature verification failed: {Message}", ex.Message);
            return BadRequest(new ResponseAPI(400, "Invalid Stripe signature."));
        }

        try
        {
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    var succeededIntent = stripeEvent.Data.Object as PaymentIntent;
                    if (succeededIntent is not null)
                    {
                        await _paymentService.UpdateOrderPaymentSucceeded(succeededIntent.Id);
                        _logger.LogInformation("PaymentIntent {Id} succeeded — order marked PaymentReceived.",
                            succeededIntent.Id);
                    }
                    break;

                case "payment_intent.payment_failed":
                    var failedIntent = stripeEvent.Data.Object as PaymentIntent;
                    if (failedIntent is not null)
                    {
                        await _paymentService.UpdateOrderPaymentFailed(failedIntent.Id);
                        _logger.LogInformation("PaymentIntent {Id} failed — order marked PaymentFailed.",
                            failedIntent.Id);
                    }
                    break;

                default:
                    _logger.LogDebug("Unhandled Stripe event type: {Type}", stripeEvent.Type);
                    break;
            }
        }
        catch (KeyNotFoundException ex)
        {
            // The event arrived but we have no matching order — log and still return 200
            // so Stripe does not keep retrying an event we cannot process.
            _logger.LogError("Stripe webhook: {Message}", ex.Message);
        }

        return Ok();
    }
}
