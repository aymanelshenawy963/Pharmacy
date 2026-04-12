using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.Property(o => o.ProductName)
               .IsRequired();

        builder.Property(o => o.Price)
               .HasColumnType("decimal(18,2)");

        builder.HasOne(o => o.Order)
               .WithMany(o => o.OrderItems)
               .HasForeignKey(o => o.OrderId)
               .OnDelete(DeleteBehavior.Restrict); // 🔥 المهم
    }
}