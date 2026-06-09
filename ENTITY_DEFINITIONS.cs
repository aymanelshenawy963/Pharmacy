// Pharmacy.Core/Entities/Prescription.cs
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Prescription : BaseEntity<int>
{
    public string PrescriptionNumber { get; set; }
    public string UserId { get; set; }

    public int? PharmacistId { get; set; }
    public string? DoctorName { get; set; }
    public string? DoctorContact { get; set; }

    public DateTime IssueDate { get; set; } = DateTime.Now;
    public DateTime ExpiryDate { get; set; }

    public string MedicineDetails { get; set; }
    public int DosageQty { get; set; }
    public string DosageUnit { get; set; } // mg, ml, tablets, etc
    public string Instructions { get; set; }

    public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Pending;
    public bool IsVerified { get; set; } = false;
    public DateTime? VerifiedAt { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Employee Pharmacist { get; set; }
}

public enum PrescriptionStatus
{
    Pending = 0,
    Used = 1,
    Expired = 2,
    Cancelled = 3
}

// ============================================

// Pharmacy.Core/Entities/InventoryLog.cs
namespace Pharmacy.Core.Entities;

public class InventoryLog : BaseEntity<int>
{
    public int ProductId { get; set; }
    public int StockBefore { get; set; }
    public int StockAfter { get; set; }
    public int QuantityChanged { get; set; }

    public InventoryTransactionType TransactionType { get; set; }
    public string Reason { get; set; }
    public string ReferencedOrderId { get; set; } // Optional reference to Order

    public DateTime Timestamp { get; set; } = DateTime.Now;
    public string CreatedBy { get; set; } // UserId or EmployeeId

    // Navigation property
    public Product Product { get; set; }
}

public enum InventoryTransactionType
{
    Sale = 0,
    Return = 1,
    Restock = 2,
    Damage = 3,
    Adjustment = 4,
    Expiry = 5
}

// ============================================

// Pharmacy.Core/Entities/StockAlert.cs
namespace Pharmacy.Core.Entities;

public class StockAlert : BaseEntity<int>
{
    public int ProductId { get; set; }
    public int MinimumThreshold { get; set; }
    public int CurrentStock { get; set; }
    public bool IsAlertActive { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? ResolvedAt { get; set; }

    // Navigation property
    public Product Product { get; set; }
}

// ============================================

// Pharmacy.Core/Entities/Supplier.cs
namespace Pharmacy.Core.Entities;

public class Supplier : BaseEntity<int>
{
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }

    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }

    public string TaxId { get; set; }
    public string PaymentTerms { get; set; } // e.g., "Net 30", "COD"

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation properties
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new HashSet<PurchaseOrder>();
}

// ============================================

// Pharmacy.Core/Entities/PurchaseOrder.cs
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class PurchaseOrder : BaseEntity<int>
{
    public string OrderNumber { get; set; }
    public int SupplierId { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;
    public DateTime? DeliveryDate { get; set; }

    public decimal TotalAmount { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal TaxAmount { get; set; }

    public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Pending;

    // Navigation properties
    public Supplier Supplier { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; } = new HashSet<PurchaseOrderItem>();
}

public class PurchaseOrderItem : BaseEntity<int>
{
    public int PurchaseOrderId { get; set; }
    public int ProductId { get; set; }

    public int OrderedQuantity { get; set; }
    public int? ReceivedQuantity { get; set; }
    public decimal UnitPrice { get; set; }

    public DateTime ExpectedDeliveryDate { get; set; }

    // Navigation properties
    public PurchaseOrder PurchaseOrder { get; set; }
    public Product Product { get; set; }
}

public enum PurchaseOrderStatus
{
    Pending = 0,
    Confirmed = 1,
    PartiallyShipped = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5
}

// ============================================

// Pharmacy.Core/Entities/ProductReview.cs
namespace Pharmacy.Core.Entities;

public class ProductReview : BaseEntity<int>
{
    public int ProductId { get; set; }
    public string UserId { get; set; }

    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; }
    public string Comment { get; set; }

    public bool IsVerifiedPurchase { get; set; }
    public int HelpfulCount { get; set; } = 0;
    public int UnhelpfulCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public Product Product { get; set; }
    public User User { get; set; }
}

// ============================================

// Pharmacy.Core/Entities/Discount.cs
namespace Pharmacy.Core.Entities;

public class Discount : BaseEntity<int>
{
    public string Code { get; set; }
    public string Description { get; set; }

    public DiscountType DiscountType { get; set; } // Percentage or Fixed
    public decimal DiscountValue { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public int? MaxUsageCount { get; set; }
    public int CurrentUsageCount { get; set; } = 0;

    public decimal? MinimumOrderAmount { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation properties
    public ICollection<Product> ApplicableProducts { get; set; } = new HashSet<Product>();
    public ICollection<Order> UsedInOrders { get; set; } = new HashSet<Order>();
}

public enum DiscountType
{
    Percentage = 0,
    FixedAmount = 1,
    FreeShipping = 2
}

// ============================================

// Pharmacy.Core/Entities/Payment.cs
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Payment : BaseEntity<int>
{
    public int OrderId { get; set; }
    public string PaymentIntentId { get; set; }

    public PaymentMethod PaymentMethod { get; set; }
    public decimal Amount { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Processing;
    public DateTime PaymentDate { get; set; }

    public string? TransactionReference { get; set; }
    public string? ErrorMessage { get; set; }
    public string? CardLastFour { get; set; }

    // Navigation property
    public Order Order { get; set; }
}

public enum PaymentMethod
{
    CreditCard = 0,
    DebitCard = 1,
    PayPal = 2,
    BankTransfer = 3,
    CashOnDelivery = 4
}

public enum PaymentStatus
{
    Processing = 0,
    Completed = 1,
    Failed = 2,
    Refunded = 3,
    PartiallyRefunded = 4,
    Cancelled = 5
}

// ============================================

// Pharmacy.Core/Entities/Return.cs
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Return : BaseEntity<int>
{
    public int OrderId { get; set; }
    public int OrderItemId { get; set; }

    public ReturnReason Reason { get; set; }
    public string Comments { get; set; }

    public int Quantity { get; set; }
    public decimal RefundAmount { get; set; }

    public ReturnStatus Status { get; set; } = ReturnStatus.Requested;

    public DateTime RequestedDate { get; set; } = DateTime.Now;
    public DateTime? ApprovedDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    public string ApprovalNotes { get; set; }

    // Navigation properties
    public Order Order { get; set; }
    public OrderItem OrderItem { get; set; }
}

public enum ReturnReason
{
    DefectiveProduct = 0,
    WrongProduct = 1,
    NotAsDescribed = 2,
    ExpiredProduct = 3,
    DamagedInShipment = 4,
    CustomerRequest = 5,
    Other = 6
}

public enum ReturnStatus
{
    Requested = 0,
    Approved = 1,
    Rejected = 2,
    Shipped = 3,
    Received = 4,
    Completed = 5
}

// ============================================

// Pharmacy.Core/Entities/Notification.cs
namespace Pharmacy.Core.Entities;

public class Notification : BaseEntity<int>
{
    public string UserId { get; set; }

    public string Title { get; set; }
    public string Message { get; set; }

    public NotificationType Type { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }

    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? ReadAt { get; set; }

    // Navigation property
    public User User { get; set; }
}

public enum NotificationType
{
    OrderUpdate = 0,
    OrderDelivered = 1,
    PrescriptionReady = 2,
    StockAlert = 3,
    ReviewResponse = 4,
    DiscountAvailable = 5,
    LowStockAlert = 6,
    SystemNotification = 7
}

// ============================================

// Pharmacy.Core/Entities/Employee.cs
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public class Employee : BaseEntity<int>
{
    public string EmployeeCode { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }

    public string? ProfileImageUrl { get; set; }

    public EmployeeRole Role { get; set; }
    public string? LicenseNumber { get; set; } // For pharmacists
    public DateTime? LicenseExpiryDate { get; set; }

    public DateTime JoiningDate { get; set; }
    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Prescription> VerifiedPrescriptions { get; set; } = new HashSet<Prescription>();
}

public enum EmployeeRole
{
    Pharmacist = 0,
    Technician = 1,
    Manager = 2,
    Cashier = 3,
    DeliveryAgent = 4,
    Admin = 5
}

// ============================================

// Pharmacy.Core/Entities/AuditLog.cs
namespace Pharmacy.Core.Entities;

public class AuditLog : BaseEntity<int>
{
    public string UserId { get; set; }
    public string Action { get; set; } // Create, Update, Delete

    public string TableName { get; set; }
    public string? RecordId { get; set; }

    public string? OldValues { get; set; } // JSON format
    public string? NewValues { get; set; } // JSON format

    public string IpAddress { get; set; }
    public string UserAgent { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.Now;
}
