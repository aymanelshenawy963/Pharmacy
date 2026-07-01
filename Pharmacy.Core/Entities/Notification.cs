using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Notification : BaseEntity<int>
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Denormalized so the notification remains readable even if the product name changes later
    public string ProductName { get; set; } = string.Empty;

    public int StockAtCreation { get; set; }

    public NotificationStatus Status { get; set; } = NotificationStatus.Active;

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }
}
