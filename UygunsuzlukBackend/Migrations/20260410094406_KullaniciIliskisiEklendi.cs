using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UygunsuzlukBackend.Migrations
{
    /// <inheritdoc />
    public partial class KullaniciIliskisiEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Mevcut integer tipindeki kolonu kaldır (veriler 0 olduğu için kayıp yok)
            migrationBuilder.DropColumn(
                name: "OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            // Aynı kolonu text tipinde yeniden oluştur (Kullanicilar.KullaniciAd ile eşleşmesi için)
            migrationBuilder.AddColumn<string>(
                name: "OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Uygunsuzluklar_OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                column: "OlusturanKullaniciId");

            migrationBuilder.AddForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar",
                column: "OlusturanKullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "KullaniciAd",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Uygunsuzluklar_Kullanicilar_OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            migrationBuilder.DropIndex(
                name: "IX_Uygunsuzluklar_OlusturanKullaniciId",
                table: "Uygunsuzluklar");

            migrationBuilder.DropColumn(
                name: "OlusturanKullaniciId",
                table: "Uygunsuzluklar");
        }
    }
}
