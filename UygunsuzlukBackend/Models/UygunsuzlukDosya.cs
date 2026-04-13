using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UygunsuzlukBackend.Models
{
    public class UygunsuzlukDosya
    {
        [Key]
        public int Id { get; set; }

        public string DosyaYolu { get; set; } = string.Empty;

        [ForeignKey("Uygunsuzluk")]
        public int UygunsuzlukId { get; set; }

        public virtual UygunsuzlukKaydi Uygunsuzluk { get; set; } = null!;
    }
}
