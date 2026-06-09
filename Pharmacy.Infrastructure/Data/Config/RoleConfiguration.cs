using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.Core.Consts;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
{
    public void Configure(EntityTypeBuilder<ApplicationRole> builder)
    {
        // Seed default roles
        builder.HasData(
            new ApplicationRole
            {
                Id = DefaultRoles.AdminRoleId,
                Name = DefaultRoles.Admin,
                NormalizedName = DefaultRoles.Admin.ToUpper(),
                ConcurrencyStamp = DefaultRoles.AdminRoleConcurrencyStamp
            },
            new ApplicationRole
            {
                Id = DefaultRoles.CustomerRoleId,
                Name = DefaultRoles.Customer,
                NormalizedName = DefaultRoles.Customer.ToUpper(),
                ConcurrencyStamp = DefaultRoles.CustomerRoleConcurrencyStamp,
                IsDefault = true 
            }
        );

    }
}