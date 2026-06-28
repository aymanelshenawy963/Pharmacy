using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Interfaces.Services;

public interface IOrderService
{
    Task<(OrderToReturnDTO? Order, string? Error)> CreateOrderAsync(string buyerEmail, CreateOrderDTO dto);
    Task<IReadOnlyList<OrderToReturnDTO>> GetOrdersForUserAsync(string buyerEmail);
    Task<OrderToReturnDTO?> GetOrderByIdAsync(int id, string buyerEmail);
    Task<IReadOnlyList<OrderToReturnDTO>> GetAllOrdersAsync();
    Task<(bool IsSuccess, string? Error)> UpdateOrderStatusAsync(int id, OrderStatus status);
    Task<(bool IsSuccess, string? Error)> CancelOrderAsync(int id, string buyerEmail);
}
