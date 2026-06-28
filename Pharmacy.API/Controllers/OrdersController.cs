using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Extentsions;
using Pharmacy.API.Helpers;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    private readonly IOrderService _orderService = orderService;

    // Resolves the buyer email from the JWT claims on every request.
    private string? BuyerEmail => User.GetUserEmail();

    /// <summary>POST /api/orders — Customer places a new order from their basket.</summary>
    [HttpPost]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO dto)
    {
        if (BuyerEmail is null)
            return Unauthorized(new ResponseAPI(401));

        var (order, error) = await _orderService.CreateOrderAsync(BuyerEmail, dto);

        if (error is not null)
            return BadRequest(new ResponseAPI(400, error));

        return CreatedAtAction(nameof(GetOrderById), new { id = order!.Id }, order);
    }

    /// <summary>GET /api/orders — Customer retrieves their own order history.</summary>
    [HttpGet]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> GetMyOrders()
    {
        if (BuyerEmail is null)
            return Unauthorized(new ResponseAPI(401));

        var orders = await _orderService.GetOrdersForUserAsync(BuyerEmail);
        return Ok(orders);
    }

    /// <summary>GET /api/orders/{id} — Customer retrieves one of their own orders.</summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> GetOrderById(int id)
    {
        if (BuyerEmail is null)
            return Unauthorized(new ResponseAPI(401));

        var order = await _orderService.GetOrderByIdAsync(id, BuyerEmail);

        if (order is null)
            return NotFound(new ResponseAPI(404, $"Order {id} not found"));

        return Ok(order);
    }

    /// <summary>PUT /api/orders/{id}/cancel — Customer cancels their own pending order.</summary>
    [HttpPut("{id:int}/cancel")]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> CancelOrder(int id)
    {
        if (BuyerEmail is null)
            return Unauthorized(new ResponseAPI(401));

        var (isSuccess, error) = await _orderService.CancelOrderAsync(id, BuyerEmail);

        if (!isSuccess)
            return BadRequest(new ResponseAPI(400, error));

        return NoContent();
    }

    /// <summary>GET /api/orders/all — Admin retrieves all orders across all customers.</summary>
    [HttpGet("all")]
    [Authorize(Roles = DefaultRoles.Admin)]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    /// <summary>PUT /api/orders/{id}/status — Admin updates the status of any order.</summary>
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = DefaultRoles.Admin)]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO dto)
    {
        var (isSuccess, error) = await _orderService.UpdateOrderStatusAsync(id, dto.Status);

        if (!isSuccess)
            return BadRequest(new ResponseAPI(400, error));

        return NoContent();
    }
}
