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


        // Seed the default admin user

        //var passwordHasher = new PasswordHasher<User>();

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
            //PasswordHash = passwordHasher.HashPassword(null, DefaultUsers.AdminPassword),
            PasswordHash = DefaultUsers.AdminPasswordHash,
        });



    }
}