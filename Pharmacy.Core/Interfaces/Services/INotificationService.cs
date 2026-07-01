using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Interfaces.Services;

public interface INotificationService
{
    /// <summary>
    /// Called by the Hangfire recurring job every minute.
    /// Scans all products, creates notifications for low-stock ones,
    /// and resolves notifications for products whose stock recovered.
    /// </summary>
    Task MonitorStockAsync();

    Task<IReadOnlyList<Notification>> GetNotificationsAsync(NotificationStatus? status = null);

    Task<int> GetUnreadCountAsync();

    /// <summary>Marks a notification as Read. Returns false if the id does not exist.</summary>
    Task<bool> MarkAsReadAsync(int notificationId);
}
