using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure.Repositories;

public class OrderRepository : GenericRepositry<Order>, IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        => await _context.Orders
            .Where(o => o.BuyerEmail == buyerEmail)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .AsNoTracking()
            .ToListAsync();

    public async Task<Order?> GetOrderByIdAsync(int id, string buyerEmail)
        => await _context.Orders
            .Where(o => o.Id == id && o.BuyerEmail == buyerEmail)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync();
}
