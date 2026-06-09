using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Pharmacy.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedIdentityData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "IsDefault", "IsDeleted", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "22ea0339-4041-4281-9e76-9124589dd633", "def11b2f-0159-4906-bed8-86abb529c996", false, false, "Admin", "ADMIN" },
                    { "c70933bd-f3cf-4e7f-83d9-a10f5dc9799f", "01530506-21fa-40cd-8e5e-6b86251892c1", true, false, "Customer", "CUSTOMER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "64b93c3a-2b6a-406c-8ae6-70a9a5b0a441", 0, "644660bb-1eaa-479f-b8b4-4807ebdeb2c0", "admin@pharmacy.com", true, "Ayman", "Admin", false, null, "ADMIN@PHARMACY.COM", "ADMIN", "AQAAAAIAAYagAAAAEFnVAVxyzPFqpVnW/e91bWX5vgyL779eXkPr0XILoma/3pK8p+5mdbDm9TlaCBiy/Q==", null, false, "6D9BC679EA30447290E0C0E68B080B9F", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "22ea0339-4041-4281-9e76-9124589dd633", "64b93c3a-2b6a-406c-8ae6-70a9a5b0a441" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c70933bd-f3cf-4e7f-83d9-a10f5dc9799f");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "22ea0339-4041-4281-9e76-9124589dd633", "64b93c3a-2b6a-406c-8ae6-70a9a5b0a441" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "22ea0339-4041-4281-9e76-9124589dd633");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "64b93c3a-2b6a-406c-8ae6-70a9a5b0a441");
        }
    }
}
