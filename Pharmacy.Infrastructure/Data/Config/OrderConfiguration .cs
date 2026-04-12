using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(o => o.BuyerEmail)
               .IsRequired();

        builder.Property(o => o.SubTotal)
               .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Status)
               .HasConversion<string>();

        // DeliveryMethod
        builder.HasOne(o => o.DeliveryMethod)
               .WithMany()
               .HasForeignKey(o => o.DeliveryMethodId)
               .OnDelete(DeleteBehavior.Restrict);

        // ShippingAddress (Value Object)
        builder.OwnsOne(o => o.ShippingAddress, sa =>
        {
            sa.Property(a => a.FirstName).IsRequired();
            sa.Property(a => a.LastName).IsRequired();
            sa.Property(a => a.City).IsRequired();
            sa.Property(a => a.Street).IsRequired();
            sa.Property(a => a.State).IsRequired();
            sa.Property(a => a.ZipCode).IsRequired();
        });
    }
}