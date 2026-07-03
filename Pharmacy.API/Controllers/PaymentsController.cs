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
[Authorize()]
public class PaymentsController(
    IPaymentService paymentService,
    IOptions<StripeSettings> stripeOptions,
    ILogger<PaymentsController> logger) : ControllerBase
{
    private readonly IPaymentService _paymentService = paymentService;
    private readonly string _webhookSecret = stripeOptions.Value.WebhookSecret;
    private readonly ILogger<PaymentsController> _logger = logger;

[Authorize(Roles = DefaultRoles.Customer)]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentsController> _logger;
    private readonly string _webhookSecret;

    public PaymentsController(
        IPaymentService paymentService,
        IOptions<StripeSettings> stripeOptions,
        ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
        _webhookSecret = stripeOptions.Value.WebhookSecret;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrUpdatePaymentIntent([FromBody] CreatePaymentIntentDTO dto)
    {
        var (basket, error) = await _paymentService.CreateOrUpdatePaymentIntentAsync(
            dto.BasketId,
            dto.DeliveryMethodId);

        if (error != null)
            return BadRequest(new ResponseAPI(400, error));

        return Ok(basket);
    }

    /// <summary>x
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
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        string json;

        using (var reader = new StreamReader(Request.Body))
        {
            json = await reader.ReadToEndAsync();
        }

        var stripeSignature = Request.Headers["Stripe-Signature"].ToString();

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _webhookSecret,
                throwOnApiVersionMismatch: false
            );
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe signature verification failed.");

            return BadRequest(new
            {
                Success = false,
                Message = ex.Message
            });
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

                    var paymentIntentSucceeded =
                        stripeEvent.Data.Object as PaymentIntent;

                    if (paymentIntentSucceeded != null)
                    {
                        await _paymentService.UpdateOrderPaymentSucceeded(
                            paymentIntentSucceeded.Id);

                        _logger.LogInformation(
                            "Payment succeeded: {Id}",
                            paymentIntentSucceeded.Id);
                    }

                    break;

                case "payment_intent.payment_failed":

                    var paymentIntentFailed =
                        stripeEvent.Data.Object as PaymentIntent;

                    if (paymentIntentFailed != null)
                    {
                        await _paymentService.UpdateOrderPaymentFailed(
                            paymentIntentFailed.Id);

                        _logger.LogInformation(
                            "Payment failed: {Id}",
                            paymentIntentFailed.Id);
                    }

                    break;

                default:

                    _logger.LogInformation(
                        "Unhandled Stripe event: {Type}",
                        stripeEvent.Type);

                    break;
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook.");

            return StatusCode(500, new
            {
                Success = false,
                Message = ex.Message
            });
        }
    }
}
