using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Models;

namespace UygunsuzlukBackend.Data
{
    public class UygunsuzlukDbContext : DbContext
    {
        public UygunsuzlukDbContext(DbContextOptions<UygunsuzlukDbContext> options) : base(options) { }

        public DbSet<UygunsuzlukKaydi> Uygunsuzluklar { get; set; }
        public DbSet<Kullanici> Kullanicilar { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // KullaniciAd benzersiz olmalı
            modelBuilder.Entity<Kullanici>()
                .HasIndex(k => k.KullaniciAd)
                .IsUnique();

            // UygunsuzlukKaydi -> Kullanici ilişkisi (int Id üzerinden)
            modelBuilder.Entity<UygunsuzlukKaydi>()
                .HasOne(u => u.OlusturanKullanici)
                .WithMany()
                .HasForeignKey(u => u.OlusturanKullaniciId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}