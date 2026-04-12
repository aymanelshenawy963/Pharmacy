
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Config;

public class DeliveyMethodConiguration : IEntityTypeConfiguration<DeliveryMethod>
{
    public void Configure(EntityTypeBuilder<DeliveryMethod> builder)
    {
        builder.Property(d => d.Name)
       .IsRequired();

        builder.Property(d => d.Description)
               .IsRequired();

        builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
        builder.HasData(
            new DeliveryMethod
            {
                Id = 1,
                Name = "Fast Delivery",
                Description = "Get your order in 1-2 days",
                Price = 9.99m,
                DeliveryTime = "1-2 days"
            },
            new DeliveryMethod
            {
                Id = 2,
                Name = "Standard Delivery",
                Description = "Get your order in 3-5 days",
                Price = 4.99m,
                DeliveryTime = "3-5 days"
            },
            new DeliveryMethod
            {
                Id = 3,
                Name = "Economy Delivery",
                Description = "Get your order in 5-7 days",
                Price = 2.99m,
                DeliveryTime = "5-7 days"
            }
        );
    }
}
