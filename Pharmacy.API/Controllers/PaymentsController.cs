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
[Authorize]
public class PaymentsController(
    IPaymentService paymentService,
    IOptions<StripeSettings> stripeOptions,
    ILogger<PaymentsController> logger) : ControllerBase
{
    private readonly IPaymentService _paymentService = paymentService;
    private readonly string _webhookSecret = stripeOptions.Value.WebhookSecret;
    private readonly ILogger<PaymentsController> _logger = logger;

    [HttpPost]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> CreateOrUpdatePaymentIntent(
        [FromBody] CreatePaymentIntentDTO dto)
    {
        var (basket, error) =
            await _paymentService.CreateOrUpdatePaymentIntentAsync(
                dto.BasketId,
                dto.DeliveryMethodId);

        if (error is not null)
            return BadRequest(new ResponseAPI(400, error));

        return Ok(basket);
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook()
    {
        string json;

        using (var reader = new StreamReader(Request.Body))
        {
            json = await reader.ReadToEndAsync();
        }

        var stripeSignature =
            Request.Headers["Stripe-Signature"].ToString();

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _webhookSecret,
                throwOnApiVersionMismatch: false);
        }
        catch (StripeException ex)
        {
            _logger.LogError(
                ex,
                "Stripe signature verification failed.");

            return BadRequest(
                new ResponseAPI(400, "Invalid Stripe signature."));
        }

        try
        {
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    {
                        var paymentIntent =
                            stripeEvent.Data.Object as PaymentIntent;

                        if (paymentIntent is not null)
                        {
                            await _paymentService
                                .UpdateOrderPaymentSucceeded(paymentIntent.Id);

                            _logger.LogInformation(
                                "PaymentIntent {Id} succeeded.",
                                paymentIntent.Id);
                        }

                        break;
                    }

                case "payment_intent.payment_failed":
                    {
                        var paymentIntent =
                            stripeEvent.Data.Object as PaymentIntent;

                        if (paymentIntent is not null)
                        {
                            await _paymentService
                                .UpdateOrderPaymentFailed(paymentIntent.Id);

                            _logger.LogInformation(
                                "PaymentIntent {Id} failed.",
                                paymentIntent.Id);
                        }

                        break;
                    }

                default:
                    _logger.LogDebug(
                        "Unhandled Stripe event type: {Type}",
                        stripeEvent.Type);
                    break;
            }
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError(
                ex,
                "No matching order was found for the Stripe event.");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing Stripe webhook.");

            return StatusCode(
                500,
                new ResponseAPI(500, "Error processing webhook."));
        }

        return Ok();
    }
}