using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.DTO;

public class NotificationDTO
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int StockAtCreation { get; set; }
    public NotificationStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
