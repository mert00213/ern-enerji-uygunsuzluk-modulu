using System.ComponentModel.DataAnnotations;

namespace UygunsuzlukBackend.Models
{
    public class Kullanici
    {
        [Key]
        public int Id { get; set; }
        public string KullaniciAd { get; set; } = string.Empty;
        public string SifreHash { get; set; } = string.Empty;
    }
}