using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Interfaces;

public interface INotificationRepository
{
    /// <summary>Returns the single Active notification for a product, or null if none exists.</summary>
    Task<Notification?> GetActiveNotificationForProductAsync(int productId);

    Task<IReadOnlyList<Notification>> GetAllAsync(NotificationStatus? status = null);

    Task<Notification?> GetByIdAsync(int id);

    Task AddAsync(Notification notification);

    void Update(Notification notification);

    Task<int> GetUnreadCountAsync();
}
