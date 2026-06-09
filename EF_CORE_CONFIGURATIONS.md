## EF Core Configuration Best Practices

### 1. Prescription Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/PrescriptionConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.Property(p => p.PrescriptionNumber)
               .IsRequired()
               .HasMaxLength(50)
               .HasAnnotation("Index", new { IsUnique = true });

        builder.Property(p => p.UserId)
               .IsRequired();

        builder.Property(p => p.MedicineDetails)
               .IsRequired()
               .HasColumnType("nvarchar(max)");

        builder.Property(p => p.Instructions)
               .IsRequired()
               .HasColumnType("nvarchar(max)");

        builder.Property(p => p.Status)
               .HasConversion<string>();

        builder.HasOne(p => p.User)
               .WithMany()
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Pharmacist)
               .WithMany(e => e.VerifiedPrescriptions)
               .HasForeignKey(p => p.PharmacistId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
```

### 2. Inventory Log Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/InventoryLogConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class InventoryLogConfiguration : IEntityTypeConfiguration<InventoryLog>
{
    public void Configure(EntityTypeBuilder<InventoryLog> builder)
    {
        builder.Property(i => i.TransactionType)
               .HasConversion<string>();

        builder.Property(i => i.Reason)
               .IsRequired()
               .HasMaxLength(500);

        builder.Property(i => i.Timestamp)
               .HasDefaultValueSql("GETDATE()");

        builder.HasOne(i => i.Product)
               .WithMany()
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(i => new { i.ProductId, i.Timestamp })
               .HasDatabaseName("IX_InventoryLog_Product_Timestamp");

        builder.HasIndex(i => i.Timestamp)
               .HasDatabaseName("IX_InventoryLog_Timestamp");
    }
}
```

### 3. Stock Alert Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/StockAlertConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class StockAlertConfiguration : IEntityTypeConfiguration<StockAlert>
{
    public void Configure(EntityTypeBuilder<StockAlert> builder)
    {
        builder.HasOne(s => s.Product)
               .WithMany()
               .HasForeignKey(s => s.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => new { s.ProductId, s.IsAlertActive })
               .HasDatabaseName("IX_StockAlert_Product_Active");

        builder.HasCheckConstraint("CK_StockAlert_Threshold", "MinimumThreshold > 0");
    }
}
```

### 4. Supplier Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/SupplierConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.Property(s => s.Name)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(s => s.Email)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(s => s.PhoneNumber)
               .IsRequired()
               .HasMaxLength(20);

        builder.Property(s => s.TaxId)
               .HasMaxLength(50);

        builder.HasIndex(s => s.Email)
               .IsUnique();

        builder.HasIndex(s => s.IsActive);

        builder.HasMany(s => s.PurchaseOrders)
               .WithOne(po => po.Supplier)
               .HasForeignKey(po => po.SupplierId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
```

### 5. Purchase Order Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/PurchaseOrderConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.Property(po => po.OrderNumber)
               .IsRequired()
               .HasMaxLength(50)
               .HasAnnotation("Index", new { IsUnique = true });

        builder.Property(po => po.TotalAmount)
               .HasColumnType("decimal(18,2)");

        builder.Property(po => po.DiscountAmount)
               .HasColumnType("decimal(18,2)");

        builder.Property(po => po.TaxAmount)
               .HasColumnType("decimal(18,2)");

        builder.Property(po => po.Status)
               .HasConversion<string>();

        builder.HasMany(po => po.Items)
               .WithOne(poi => poi.PurchaseOrder)
               .HasForeignKey(poi => poi.PurchaseOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(po => po.Status);
        builder.HasIndex(po => po.OrderDate);
    }
}
```

### 6. Product Review Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/ProductReviewConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class ProductReviewConfiguration : IEntityTypeConfiguration<ProductReview>
{
    public void Configure(EntityTypeBuilder<ProductReview> builder)
    {
        builder.Property(pr => pr.Title)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(pr => pr.Comment)
               .HasMaxLength(1000);

        builder.HasOne(pr => pr.Product)
               .WithMany()
               .HasForeignKey(pr => pr.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pr => pr.User)
               .WithMany()
               .HasForeignKey(pr => pr.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(pr => new { pr.ProductId, pr.Rating })
               .HasDatabaseName("IX_Review_Product_Rating");

        builder.HasIndex(pr => pr.CreatedAt);

        builder.HasCheckConstraint("CK_Review_Rating", "Rating BETWEEN 1 AND 5");
    }
}
```

### 7. Discount Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/DiscountConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class DiscountConfiguration : IEntityTypeConfiguration<Discount>
{
    public void Configure(EntityTypeBuilder<Discount> builder)
    {
        builder.Property(d => d.Code)
               .IsRequired()
               .HasMaxLength(50)
               .HasAnnotation("Index", new { IsUnique = true });

        builder.Property(d => d.Description)
               .HasMaxLength(500);

        builder.Property(d => d.DiscountType)
               .HasConversion<string>();

        builder.Property(d => d.DiscountValue)
               .HasColumnType("decimal(18,2)");

        builder.Property(d => d.MinimumOrderAmount)
               .HasColumnType("decimal(18,2)");

        builder.HasMany(d => d.ApplicableProducts)
               .WithMany()
               .UsingEntity(j => j.ToTable("DiscountProduct"));

        builder.HasIndex(d => d.IsActive);
        builder.HasIndex(d => d.StartDate);
    }
}
```

### 8. Payment Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/PaymentConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.PaymentIntentId)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(p => p.PaymentMethod)
               .HasConversion<string>();

        builder.Property(p => p.Status)
               .HasConversion<string>();

        builder.Property(p => p.Amount)
               .HasColumnType("decimal(18,2)");

        builder.Property(p => p.CardLastFour)
               .HasMaxLength(4);

        builder.HasOne(p => p.Order)
               .WithMany()
               .HasForeignKey(p => p.OrderId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.PaymentIntentId)
               .IsUnique();

        builder.HasIndex(p => p.Status);
    }
}
```

### 9. Return Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/ReturnConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class ReturnConfiguration : IEntityTypeConfiguration<Return>
{
    public void Configure(EntityTypeBuilder<Return> builder)
    {
        builder.Property(r => r.Reason)
               .HasConversion<string>();

        builder.Property(r => r.Status)
               .HasConversion<string>();

        builder.Property(r => r.RefundAmount)
               .HasColumnType("decimal(18,2)");

        builder.Property(r => r.Comments)
               .HasMaxLength(1000);

        builder.HasOne(r => r.Order)
               .WithMany()
               .HasForeignKey(r => r.OrderId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.OrderItem)
               .WithMany()
               .HasForeignKey(r => r.OrderItemId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => new { r.OrderId, r.Status })
               .HasDatabaseName("IX_Return_Order_Status");

        builder.HasIndex(r => r.RequestedDate);
    }
}
```

### 10. Notification Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/NotificationConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.Property(n => n.Title)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(n => n.Message)
               .IsRequired()
               .HasColumnType("nvarchar(max)");

        builder.Property(n => n.Type)
               .HasConversion<string>();

        builder.HasOne(n => n.User)
               .WithMany()
               .HasForeignKey(n => n.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => new { n.UserId, n.IsRead })
               .HasDatabaseName("IX_Notification_User_Read");

        builder.HasIndex(n => n.CreatedAt);
    }
}
```

### 11. Employee Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/EmployeeConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.Property(e => e.EmployeeCode)
               .IsRequired()
               .HasMaxLength(50)
               .HasAnnotation("Index", new { IsUnique = true });

        builder.Property(e => e.FirstName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(e => e.LastName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(e => e.Email)
               .IsRequired()
               .HasMaxLength(100)
               .HasAnnotation("Index", new { IsUnique = true });

        builder.Property(e => e.Role)
               .HasConversion<string>();

        builder.Property(e => e.LicenseNumber)
               .HasMaxLength(50);

        builder.HasMany(e => e.VerifiedPrescriptions)
               .WithOne(p => p.Pharmacist)
               .HasForeignKey(p => p.PharmacistId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(e => e.IsActive);
        builder.HasIndex(e => e.Role);
    }
}
```

### 12. Audit Log Configuration

```csharp
// Pharmacy.Infrastructure/Data/Config/AuditLogConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.Property(a => a.Action)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(a => a.TableName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(a => a.OldValues)
               .HasColumnType("nvarchar(max)");

        builder.Property(a => a.NewValues)
               .HasColumnType("nvarchar(max)");

        builder.Property(a => a.IpAddress)
               .HasMaxLength(50);

        builder.Property(a => a.Timestamp)
               .HasDefaultValueSql("GETDATE()")
               .HasPrecision(7);

        builder.HasIndex(a => new { a.TableName, a.RecordId })
               .HasDatabaseName("IX_AuditLog_Table_Record");

        builder.HasIndex(a => a.Timestamp);

        // Don't allow deletes of audit logs (append-only)
        builder.HasAnnotation("SqlServer:IsTemporal", true);
    }
}
```

---

## Enhanced AppDbContext

```csharp
// Pharmacy.Infrastructure/Data/AppDbContext.cs
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;
using System.Reflection;

namespace Pharmacy.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Current DbSets
    public DbSet<Photo> Photos { get; set; }
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<Address> Addresses { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<OrderItem> OrderItems { get; set; }
    public virtual DbSet<DeliveryMethod> DeliveryMethods { get; set; }

    // New DbSets for Pharmacy Features
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<InventoryLog> InventoryLogs { get; set; }
    public DbSet<StockAlert> StockAlerts { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<Discount> Discounts { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Return> Returns { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Global query filters (optional)
        modelBuilder.Entity<Employee>().HasQueryFilter(e => e.IsActive);
        modelBuilder.Entity<Supplier>().HasQueryFilter(s => s.IsActive);
        modelBuilder.Entity<Discount>().HasQueryFilter(d => d.IsActive);
    }
}
```

---

## Key Points for Implementation

1. **All Configurations** should be placed in `Pharmacy.Infrastructure/Data/Config/` folder
2. **Use shadow properties** for soft deletes if needed:

   ```csharp
   builder.Property<DateTime?>("DeletedAt");
   builder.HasQueryFilter(e => EF.Property<DateTime?>(e, "DeletedAt") == null);
   ```

3. **Always use `HasConversion<string>()`** for enums to make them queryable

4. **Use `HasCheckConstraint`** for business rule validation at database level

5. **Create composite indexes** for common filter combinations

6. **Use `OnDelete(DeleteBehavior.Restrict)`** to prevent accidental cascading deletes of critical data

This provides a complete roadmap for extending your pharmacy system's database layer.
