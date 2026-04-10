using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UygunsuzlukBackend.Migrations
{
    /// <inheritdoc />
    public partial class DosyaYoluEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DosyaYolu",
                table: "Uygunsuzluklar",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DosyaYolu",
                table: "Uygunsuzluklar");
        }
    }
}
