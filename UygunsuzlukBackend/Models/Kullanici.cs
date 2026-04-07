using System.ComponentModel.DataAnnotations;

namespace UygunsuzlukBackend.Models
{
    public class Kullanici
    {
        [Key]
        public string KullaniciAd { get; set; } = string.Empty;
        public string SifreHash { get; set; } = string.Empty;
    }
}