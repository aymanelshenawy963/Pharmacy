using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.Property(c => c.Name)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(c => c.Description)
               .HasMaxLength(500);

        builder.HasData(
            new Category { Id = 1, Name = "Pain Relief", Description = "Medications for pain relief." },
            new Category { Id = 2, Name = "Cold and Flu", Description = "Medications for cold and flu symptoms." },
            new Category { Id = 3, Name = "Vitamins and Supplements", Description = "Vitamins and dietary supplements." }
        );

    }
}