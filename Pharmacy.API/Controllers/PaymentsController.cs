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