using System.ComponentModel.DataAnnotations.Schema;

namespace UygunsuzlukBackend.Models
{
    public class UygunsuzlukKaydi
    {
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public string FotografYolu { get; set; } = string.Empty;
        public DateTime TespitTarihi { get; set; } = DateTime.UtcNow; 
        public bool CozulduMu { get; set; } = false;

        // --- PROFESYONEL SİLME (SOFT DELETE) İÇİN EKLENEN KISIM ---
        public bool SilindiMi { get; set; } = false;

        // --- KULLANICI İLİŞKİSİ (FOREIGN KEY) ---
        [ForeignKey("OlusturanKullanici")]
        public int? OlusturanKullaniciId { get; set; }

        public virtual Kullanici? OlusturanKullanici { get; set; }
    }
}