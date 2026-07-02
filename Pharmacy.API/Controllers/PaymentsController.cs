using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = DefaultRoles.Customer)]
public class PaymentsController(IPaymentService paymentService) : ControllerBase
{
    private readonly IPaymentService _paymentService = paymentService;

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
}
