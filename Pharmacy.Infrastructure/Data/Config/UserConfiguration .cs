using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Consts;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.FirstName)
               .HasMaxLength(100);
        builder.Property(u => u.LastName)
               .HasMaxLength(100);

        builder
       .OwnsMany(u => u.RefreshTokens).ToTable("RefreshTokens");

        builder.OwnsOne(u => u.EmailOtp, otp =>
        {
            otp.Property(o => o.Code).HasColumnName("EmailOtpCode").HasMaxLength(6);
            otp.Property(o => o.ExpiresOn).HasColumnName("EmailOtpExpiresOn");
        });

        builder.OwnsOne(u => u.PasswordResetOtp, otp =>
        {
            otp.Property(o => o.Code).HasColumnName("PasswordResetOtpCode").HasMaxLength(6);
            otp.Property(o => o.ExpiresOn).HasColumnName("PasswordResetOtpExpiresOn");
        });

        // Seed the default admin user
        builder.HasData(new User
        {
            Id = DefaultUsers.AdminId,
            FirstName = DefaultUsers.AdminFirstName,
            LastName = DefaultUsers.AdminLastName,
            UserName = DefaultUsers.AdminUserName,
            NormalizedUserName = DefaultUsers.AdminUserName.ToUpper(),
            Email = DefaultUsers.AdminEmail,
            NormalizedEmail = DefaultUsers.AdminEmail.ToUpper(),
            SecurityStamp = DefaultUsers.AdminSecurityStamp,
            ConcurrencyStamp = DefaultUsers.AdminConcurrencyStamp,
            EmailConfirmed = true,
            PasswordHash = DefaultUsers.AdminPasswordHash,
        });
    }
}