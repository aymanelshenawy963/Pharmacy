using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure.Repositories;

public class NotificationRepository(AppDbContext context) : INotificationRepository
{
    public async Task<Notification?> GetActiveNotificationForProductAsync(int productId)
        => await context.Notifications
            .FirstOrDefaultAsync(n => n.ProductId == productId && n.Status == NotificationStatus.Active);

    public async Task<IReadOnlyList<Notification>> GetAllAsync(NotificationStatus? status = null)
    {
        var query = context.Notifications.AsQueryable();

        if (status.HasValue)
            query = query.Where(n => n.Status == status.Value);

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(int id)
        => await context.Notifications.FindAsync(id);

    public async Task AddAsync(Notification notification)
        => await context.Notifications.AddAsync(notification);

    public void Update(Notification notification)
        => context.Notifications.Update(notification);

    public async Task<int> GetUnreadCountAsync()
        => await context.Notifications.CountAsync(n => n.Status == NotificationStatus.Active);
}
