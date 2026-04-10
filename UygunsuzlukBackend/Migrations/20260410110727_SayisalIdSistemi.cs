using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UygunsuzlukBackend.Migrations
{
    /// <inheritdoc />
    public partial class SayisalIdSistemi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Önce VIEW'ı kaldır (kolon tip değişikliğini engelliyor)
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS ""vw_UygunsuzlukDetay"";");

            migrationBuilder.DropForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            migrationBuilder.DropIndex(
                name: "IX_Uygunsuzluklar_OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Kullanicilar",
                table: "Kullanicilar");

            // --- PostgreSQL'de text → integer dönüşümü USING ile yapılmalı ---
            // Önce mevcut text verileri NULL'a çeviriyoruz (eski text değerler integer'a cast edilemez)
            migrationBuilder.Sql(
                @"UPDATE ""Uygunsuzluklar"" SET ""OlusturanKullaniciId"" = NULL;");

            migrationBuilder.Sql(
                @"ALTER TABLE ""Uygunsuzluklar"" ALTER COLUMN ""OlusturanKullaniciId"" TYPE integer USING ""OlusturanKullaniciId""::integer;");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Kullanicilar",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kullanicilar",
                table: "Kullanicilar",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_KullaniciAd",
                table: "Kullanicilar",
                column: "KullaniciAd",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Uygunsuzluklar_OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                column: "OlusturanKullaniciId");

            migrationBuilder.AddForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                column: "OlusturanKullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Kullanicilar",
                table: "Kullanicilar");

            migrationBuilder.DropIndex(
                name: "IX_Kullanicilar_KullaniciAd",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Kullanicilar");

            migrationBuilder.AlterColumn<string>(
                name: "OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kullanicilar",
                table: "Kullanicilar",
                column: "KullaniciAd");

            migrationBuilder.AddForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                column: "OlusturanKullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "KullaniciAd",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
