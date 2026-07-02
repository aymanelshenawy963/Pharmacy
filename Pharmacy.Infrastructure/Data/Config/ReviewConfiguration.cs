using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.Property(r => r.UserId).IsRequired();

        builder.Property(r => r.Comment)
               .IsRequired()
               .HasMaxLength(1000);

        builder.Property(r => r.Rating).IsRequired();

        builder.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "[Rating] >= 1 AND [Rating] <= 5"));

        builder.HasOne(r => r.Product)
               .WithMany()
               .HasForeignKey(r => r.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        // String FK to AspNetUsers — must restrict to avoid multiple cascade paths
        builder.HasOne(r => r.Reviewer)
               .WithMany()
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
