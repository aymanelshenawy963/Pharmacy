using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Pharmacy.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class seedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Medications for pain relief.", "Pain Relief" },
                    { 2, "Medications for cold and flu symptoms.", "Cold and Flu" },
                    { 3, "Vitamins and dietary supplements.", "Vitamins and Supplements" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "Description", "HasStrips", "Name", "NewPrice", "OldPrice", "RequiresPrescription", "Stock", "StripCount", "TopSelling" },
                values: new object[,]
                {
                    { 1, 1, "Pain reliever and anti-inflammatory medication.", false, "Aspirin", 9.99m, 14.99m, false, 100, null, true },
                    { 2, 1, "Antibiotic used to treat bacterial infections.", false, "Amoxicillin", 19.99m, 24.99m, true, 50, null, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
