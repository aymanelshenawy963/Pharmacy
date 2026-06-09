# Pharmacy System - Database Schema Design

## Overview

This document provides a comprehensive database schema design for a pharmacy management system built with ASP.NET Core and Entity Framework Core.

---

## Current Database Schema (Implemented)

### 1. **User Management**

#### User Table (AspNetUsers + Extended)

```
User (extends IdentityUser)
├── Id (PK) - string (from IdentityUser)
├── Email - string (unique, from IdentityUser)
├── UserName - string (unique, from IdentityUser)
├── PasswordHash - string (from IdentityUser)
├── DisplayName - string (max 50, required)
├── Role - UserRole enum (stored as string)
├── IsActive - boolean (default: true)
├── PhoneNumber - string (from IdentityUser)
├── AddressId (FK) - int (optional)
├── CreatedDate - DateTime (from IdentityUser - DateCreated)
└── LastLogin - DateTime (from IdentityUser - LockoutEnd)
```

#### Address Table

```
Address (relates to User 1-to-1)
├── Id (PK) - int
├── UserId (FK) - string (unique)
├── FirstName - string
├── LastName - string
├── Street - string
├── City - string
├── State - string
├── ZipCode - string
└── CreatedAt - DateTime
```

### 2. **Product Management**

#### Product Table

```
Product
├── Id (PK) - int
├── Name - string (required)
├── Description - string (required)
├── NewPrice - decimal(18,2)
├── OldPrice - decimal(18,2)
├── Stock - int (default: 0)
├── RequiresPrescription - boolean
├── HasStrips - boolean
├── StripCount - int (nullable)
├── TopSelling - boolean
├── CategoryId (FK) - int (required)
└── CreatedAt - DateTime
```

**Relationships:**

- Product → Category (Many-to-One)
- Product → Photo (One-to-Many)

#### Category Table

```
Category
├── Id (PK) - int
├── Name - string
├── Description - string
└── CreatedAt - DateTime
```

**Relationships:**

- Category ← Product (One-to-Many)

#### Photo Table

```
Photo
├── Id (PK) - int
├── ImageName - string
├── ProductId (FK) - int (required)
└── CreatedAt - DateTime
```

**Relationships:**

- Photo → Product (Many-to-One)

### 3. **Order Management**

#### Order Table

```
Order
├── Id (PK) - int
├── BuyerEmail - string
├── SubTotal - decimal(18,2)
├── OrderDate - DateTime (default: now)
├── Status - OrderStatus enum (Pending, Processing, Shipped, Delivered, Cancelled)
├── PaymentIntentId - string
├── DeliveryMethodId (FK) - int
├── ShippingAddress - ShippingAddress (owned entity)
└── CreatedAt - DateTime
```

**Relationships:**

- Order → DeliveryMethod (Many-to-One)
- Order → OrderItem (One-to-Many)

#### OrderItem Table

```
OrderItem
├── Id (PK) - int
├── ProductId - int
├── OrderId (FK) - int (required)
├── MainImage - string
├── ProductName - string
├── Price - decimal(18,2)
├── Quantity - int
└── CreatedAt - DateTime
```

**Relationships:**

- OrderItem → Order (Many-to-One)

#### DeliveryMethod Table

```
DeliveryMethod
├── Id (PK) - int
├── Name - string
├── Description - string
├── Price - decimal(18,2)
├── DeliveryTime - string
└── IsActive - boolean
```

#### ShippingAddress (Owned Entity)

```
ShippingAddress
├── FirstName - string
├── LastName - string
├── Street - string
├── City - string
├── State - string
├── ZipCode - string
└── PhoneNumber - string
```

### 4. **Basket Management (Redis)**

#### Basket (Redis Cache)

```
Basket
├── Id (PK) - string (GUID)
├── PaymentIntentId - string (nullable)
├── ClientSecret - string (nullable)
└── Items - List<BasketItem>[]
```

#### BasketItem

```
BasketItem
├── ProductId - int
├── ProductName - string
├── Description - string
├── Image - string
├── Price - decimal(18,2)
├── Quantity - int
└── Category - string
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│        User         │
├─────────────────────┤
│ Id (PK)             │
│ Email               │
│ DisplayName         │
│ Role                │
│ IsActive            │
│ AddressId (FK) ────┐│
└─────────────────────┘│
                       │
                    1:1│
                       │
┌──────────────────────▼┐
│      Address          │
├──────────────────────┤
│ Id (PK)              │
│ UserId (FK) ◄───────┘
│ FirstName            │
│ LastName             │
│ Street, City, State  │
│ ZipCode              │
└──────────────────────┘


┌──────────────────┐         ┌──────────────────┐
│    Category      │◄────┬───│     Product      │
├──────────────────┤     │1:N├──────────────────┤
│ Id (PK)          │     │   │ Id (PK)          │
│ Name             │     │   │ Name             │
│ Description      │     │   │ Description      │
└──────────────────┘     │   │ NewPrice         │
                         │   │ OldPrice         │
                         │   │ Stock            │
                         │   │ CategoryId (FK) ─┘
                         │   │ RequiresPrescription
                         │   │ TopSelling       │
                         │   └──────────────────┘
                         │          │
                         │       1:N│
                         │          │
                         │   ┌──────▼──────────┐
                         └───│     Photo       │
                             ├─────────────────┤
                             │ Id (PK)         │
                             │ ImageName       │
                             │ ProductId (FK)  │
                             └─────────────────┘


┌──────────────────────┐      ┌──────────────────┐
│      Order           │◄─────│  DeliveryMethod  │
├──────────────────────┤  1:N ├──────────────────┤
│ Id (PK)              │      │ Id (PK)          │
│ BuyerEmail           │      │ Name             │
│ SubTotal             │      │ Description      │
│ OrderDate            │      │ Price            │
│ Status               │      │ DeliveryTime     │
│ PaymentIntentId      │      └──────────────────┘
│ DeliveryMethodId(FK) │
│ ShippingAddress      │
└────────────┬─────────┘
             │
          1:N│
             │
      ┌──────▼──────────┐
      │   OrderItem     │
      ├─────────────────┤
      │ Id (PK)         │
      │ ProductId       │
      │ OrderId (FK)    │
      │ ProductName     │
      │ Price           │
      │ Quantity        │
      └─────────────────┘
```

---

## Recommended Database Enhancements

### For Production Readiness:

#### 1. **Prescription Management** (if required)

```csharp
public class Prescription : BaseEntity<int>
{
    public string PrescriptionNumber { get; set; } // Unique identifier
    public string UserId { get; set; } // Reference to User
    public int PharmacistId { get; set; } // Pharmacist who issued
    public string? DoctorName { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string MedicineDetails { get; set; }
    public int DosageQty { get; set; }
    public string Instructions { get; set; }
    public PrescriptionStatus Status { get; set; } // Pending, Used, Expired
    public bool IsVerified { get; set; }

    // Relationships
    public User User { get; set; }
}

public enum PrescriptionStatus
{
    Pending = 0,
    Used = 1,
    Expired = 2,
    Cancelled = 3
}
```

#### 2. **Inventory Tracking**

```csharp
public class InventoryLog : BaseEntity<int>
{
    public int ProductId { get; set; }
    public int StockBefore { get; set; }
    public int StockAfter { get; set; }
    public int QuantityChanged { get; set; }
    public string TransactionType { get; set; } // Sale, Return, Restock, Damage
    public string Reason { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;

    // Relationships
    public Product Product { get; set; }
}

public class StockAlert : BaseEntity<int>
{
    public int ProductId { get; set; }
    public int MinimumThreshold { get; set; }
    public int CurrentStock { get; set; }
    public bool IsAlertActive { get; set; }
    public DateTime CreatedAt { get; set; }

    // Relationships
    public Product Product { get; set; }
}
```

#### 3. **Supplier/Vendor Management**

```csharp
public class Supplier : BaseEntity<int>
{
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public bool IsActive { get; set; } = true;

    // Relationships
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; }
}

public class PurchaseOrder : BaseEntity<int>
{
    public string OrderNumber { get; set; }
    public int SupplierId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public PurchaseOrderStatus Status { get; set; }

    // Relationships
    public Supplier Supplier { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; }
}

public class PurchaseOrderItem : BaseEntity<int>
{
    public int PurchaseOrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateTime ExpectedDeliveryDate { get; set; }
}

public enum PurchaseOrderStatus
{
    Pending = 0,
    Confirmed = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}
```

#### 4. **Review & Rating System**

```csharp
public class ProductReview : BaseEntity<int>
{
    public int ProductId { get; set; }
    public string UserId { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; }
    public string Comment { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }

    // Relationships
    public Product Product { get; set; }
    public User User { get; set; }
}
```

#### 5. **Discount & Promotion System**

```csharp
public class Discount : BaseEntity<int>
{
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal DiscountPercentage { get; set; }
    public decimal? FixedAmount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? MaxUses { get; set; }
    public int TimesUsed { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Relationships
    public ICollection<Product> ApplicableProducts { get; set; }
    public ICollection<Order> UsedInOrders { get; set; }
}
```

#### 6. **Payment Records**

```csharp
public class Payment : BaseEntity<int>
{
    public int OrderId { get; set; }
    public string PaymentIntentId { get; set; }
    public string PaymentMethod { get; set; } // Card, PayPal, etc
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } // Processing, Completed, Failed, Refunded
    public DateTime PaymentDate { get; set; }
    public string? TransactionReference { get; set; }
    public string? ErrorMessage { get; set; }

    // Relationships
    public Order Order { get; set; }
}

public enum PaymentStatus
{
    Processing = 0,
    Completed = 1,
    Failed = 2,
    Refunded = 3,
    Cancelled = 4
}
```

#### 7. **Return & Refund Management**

```csharp
public class Return : BaseEntity<int>
{
    public int OrderId { get; set; }
    public int OrderItemId { get; set; }
    public ReturnReason Reason { get; set; }
    public string? Comments { get; set; }
    public int Quantity { get; set; }
    public decimal RefundAmount { get; set; }
    public ReturnStatus Status { get; set; } // Requested, Approved, Rejected, Completed
    public DateTime RequestedDate { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    // Relationships
    public Order Order { get; set; }
    public OrderItem OrderItem { get; set; }
}

public enum ReturnReason
{
    DefectiveProduct = 0,
    WrongProduct = 1,
    NotAsDescribed = 2,
    ExpiredProduct = 3,
    CustomerRequest = 4,
    Other = 5
}

public enum ReturnStatus
{
    Requested = 0,
    Approved = 1,
    Rejected = 2,
    Shipped = 3,
    Completed = 4
}
```

#### 8. **Notification System**

```csharp
public class Notification : BaseEntity<int>
{
    public string UserId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public string Type { get; set; } // OrderUpdate, PrescriptionReady, StockAlert, etc
    public string? RelatedEntityId { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }

    // Relationships
    public User User { get; set; }
}
```

#### 9. **Employee/Pharmacist Management**

```csharp
public class Employee : BaseEntity<int>
{
    public string EmployeeCode { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public EmployeeRole Role { get; set; } // Pharmacist, Technician, Manager, etc
    public string? License { get; set; } // License number for pharmacists
    public DateTime JoiningDate { get; set; }
    public bool IsActive { get; set; } = true;

    // Relationships
    public ICollection<Prescription> VerifiedPrescriptions { get; set; }
}

public enum EmployeeRole
{
    Pharmacist = 0,
    Technician = 1,
    Manager = 2,
    Cashier = 3,
    Delivery = 4
}
```

#### 10. **Audit Trail**

```csharp
public class AuditLog : BaseEntity<int>
{
    public string UserId { get; set; }
    public string Action { get; set; }
    public string TableName { get; set; }
    public string? RecordId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime Timestamp { get; set; }
}
```

---

## Database Indexing Strategy

### Recommended Indexes:

```sql
-- Performance Indexes
CREATE INDEX IX_Product_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Product_Name ON Products(Name);
CREATE INDEX IX_OrderItem_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItem_ProductId ON OrderItems(ProductId);
CREATE INDEX IX_Photo_ProductId ON Photos(ProductId);
CREATE INDEX IX_Order_BuyerEmail ON Orders(BuyerEmail);
CREATE INDEX IX_Order_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_Order_Status ON Orders(Status);
CREATE UNIQUE INDEX IX_User_Email ON AspNetUsers(Email);
CREATE UNIQUE INDEX IX_Category_Name ON Categories(Name);

-- Search Indexes
CREATE FULLTEXT INDEX IX_Product_Search
    ON Products(Name, Description);
```

---

## Data Integrity Constraints

### Cascade Delete Strategy:

- **ON DELETE RESTRICT**: Product ← Category (prevent orphaned products)
- **ON DELETE CASCADE**: Order → OrderItem (delete items when order is deleted)
- **ON DELETE CASCADE**: Category → Product (optional)

### Check Constraints:

```sql
-- Product prices must be positive
ALTER TABLE Products
ADD CONSTRAINT CK_Product_Price CHECK (NewPrice >= 0 AND OldPrice >= 0);

-- Stock cannot be negative
ALTER TABLE Products
ADD CONSTRAINT CK_Product_Stock CHECK (Stock >= 0);

-- Rating must be 1-5
ALTER TABLE ProductReviews
ADD CONSTRAINT CK_Review_Rating CHECK (Rating BETWEEN 1 AND 5);

-- Order dates must be valid
ALTER TABLE Orders
ADD CONSTRAINT CK_Order_Dates CHECK (OrderDate <= GETDATE());
```

---

## Security Considerations

1. **Sensitive Data**: Store passwords using ASP.NET Identity (hashed)
2. **PII**: Encrypt addresses in production using SQL Server encryption
3. **Payment Data**: Never store full credit card numbers (use PaymentIntentId)
4. **Audit Trail**: Track all changes to critical entities
5. **Row-Level Security**: Implement for multi-tenant scenarios

---

## Performance Optimization

### Connection Pooling:

```csharp
// In appsettings.json
"Max Pool Size": 30,
"Min Pool Size": 5
```

### Query Optimization:

- Use `.AsNoTracking()` for read-only queries
- Implement pagination for large result sets
- Use lazy loading carefully; prefer explicit loading
- Create composite indexes for common filters

### Caching Strategy:

- Basket: Redis (already implemented)
- Products: Redis cache with 24-hour TTL
- Categories: Static cache (invalidate on changes)

---

## Migration Strategy

### Migration Commands:

```bash
# Add migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove migration
dotnet ef migrations remove

# Script migrations
dotnet ef migrations script
```

---

## Summary

**Current Implementation:**

- ✅ Core user & authentication
- ✅ Product & category management
- ✅ Order processing
- ✅ Basket functionality (Redis)

**Recommended Additions:**

- Prescription management (pharmacy-specific)
- Inventory tracking & stock alerts
- Supplier management
- Return & refund handling
- Review & rating system
- Discount & promotion codes
- Payment record tracking
- Employee/Pharmacist management
- Audit trail for compliance

This schema provides a solid foundation and can be extended based on specific business requirements.
