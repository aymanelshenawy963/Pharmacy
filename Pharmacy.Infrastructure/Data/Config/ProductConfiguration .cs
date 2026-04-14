using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(x => x.Name).IsRequired();
        builder.Property(x => x.Description).IsRequired();
        builder.Property(x => x.NewPrice).HasColumnType("decimal(18,2)");
        builder.Property(x => x.OldPrice).HasColumnType("decimal(18,2)");

        builder.Property(p => p.Stock)
               .HasDefaultValue(0);



        builder.HasOne(p => p.Category)
               .WithMany(c => c.Products)
               .HasForeignKey(p => p.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);


        builder.HasData(
            new Product
            {
                Id = 1,
                Name = "Aspirin",
                Description = "Pain reliever and anti-inflammatory medication.",
                NewPrice = 9.99m,
                OldPrice = 14.99m,
                Stock = 100,
                RequiresPrescription = false,
                HasStrips = false,
                StripCount = null,
                TopSelling = true,
                CategoryId = 1
            },
            new Product
            {
                Id = 2,
                Name = "Amoxicillin",
                Description = "Antibiotic used to treat bacterial infections.",
                NewPrice = 19.99m,
                OldPrice = 24.99m,
                Stock = 50,
                RequiresPrescription = true,
                HasStrips = false,
                StripCount = null,
                TopSelling = true,
                CategoryId = 1
            }
        );
    }
}