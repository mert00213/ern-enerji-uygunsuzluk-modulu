using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Models;

namespace UygunsuzlukBackend.Data
{
    public class UygunsuzlukDbContext : DbContext
    {
        public UygunsuzlukDbContext(DbContextOptions<UygunsuzlukDbContext> options) : base(options) { }

        public DbSet<UygunsuzlukKaydi> Uygunsuzluklar { get; set; }
        public DbSet<Kullanici> Kullanicilar { get; set; }
    }
}