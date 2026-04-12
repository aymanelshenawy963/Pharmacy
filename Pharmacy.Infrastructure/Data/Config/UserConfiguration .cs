using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.DisplayName)
               .IsRequired()
               .HasMaxLength(50);


        builder.Property(u => u.Role)
               .HasConversion<string>(); // 🔥 Enum كـ string

        builder.Property(u => u.IsActive)
               .HasDefaultValue(true);


    }
}