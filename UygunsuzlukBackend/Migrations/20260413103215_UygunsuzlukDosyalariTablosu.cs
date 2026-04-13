using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UygunsuzlukBackend.Migrations
{
    /// <inheritdoc />
    public partial class UygunsuzlukDosyalariTablosu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UygunsuzlukDosyalari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DosyaYolu = table.Column<string>(type: "text", nullable: false),
                    UygunsuzlukId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UygunsuzlukDosyalari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UygunsuzlukDosyalari_Uygunsuzluklar_UygunsuzlukId",
                        column: x => x.UygunsuzlukId,
                        principalTable: "Uygunsuzluklar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UygunsuzlukDosyalari_UygunsuzlukId",
                table: "UygunsuzlukDosyalari",
                column: "UygunsuzlukId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UygunsuzlukDosyalari");
        }
    }
}
