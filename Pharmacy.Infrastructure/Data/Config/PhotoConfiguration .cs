using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class PhotoConfiguration : IEntityTypeConfiguration<Photo>
{
    public void Configure(EntityTypeBuilder<Photo> builder)
    {
        builder.Property(p => p.ImageName)
               .IsRequired();

        builder.HasOne(p => p.Product)
               .WithMany(p => p.Photos)
               .HasForeignKey(p => p.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(
            new Photo { Id=1,ImageName="test",ProductId=1}
            );
    }
}