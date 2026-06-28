using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Interfaces;

public interface IOrderRepository : IGenericRepositry<Order>
{
    Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
    Task<Order?> GetOrderByIdAsync(int id, string buyerEmail);
}
