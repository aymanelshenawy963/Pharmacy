using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.Property(a => a.FirstName).IsRequired();
        builder.Property(a => a.LastName).IsRequired();

        builder.Property(a => a.City).IsRequired();
        builder.Property(a => a.Street).IsRequired();
        builder.Property(a => a.State).IsRequired();
        builder.Property(a => a.ZipCode).IsRequired();
    }
}