using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Data;
using UygunsuzlukBackend.Models;

namespace UygunsuzlukBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UygunsuzlukController : ControllerBase
    {
        private readonly UygunsuzlukDbContext _context;
        private readonly IWebHostEnvironment _env;

        // İzin verilen dosya uzantıları (Sadece resmi dokümanlar)
        private static readonly string[] IzinVerilenUzantilar = { ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
        private const long MaxDosyaBoyutu = 10 * 1024 * 1024; // 10 MB

        public UygunsuzlukController(UygunsuzlukDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // 1. LİSTELEME (GET) - GÜNCELLENDİ
        [HttpGet]
        public async Task<ActionResult> GetUygunsuzluklar()
        {
            var sonuc = await _context.Uygunsuzluklar
                .Include(k => k.OlusturanKullanici)
                .Include(k => k.Dosyalar)
                .Where(k => k.SilindiMi == false)
                .OrderByDescending(k => k.TespitTarihi)
                .Select(k => new
                {
                    k.Id,
                    k.Baslik,
                    k.Aciklama,
                    k.TespitTarihi,
                    k.FotografYolu,
                    k.DosyaYolu,
                    k.CozulduMu,
                    EkleyenKisi = k.OlusturanKullanici != null ? k.OlusturanKullanici.KullaniciAd : null,
                    Dosyalar = k.Dosyalar.Select(d => d.DosyaYolu).ToList()
                })
                .ToListAsync();

            return Ok(sonuc);
        }

        // 2. EKLEME (POST) - FormData ile Çoklu Dosya Yükleme Destekli
        [HttpPost]
        [RequestSizeLimit(100 * 1024 * 1024)] // Çoklu dosya için 100 MB limit
        public async Task<ActionResult<UygunsuzlukKaydi>> PostUygunsuzluk([FromForm] UygunsuzlukKaydi kayit, List<IFormFile>? ekBelgeler)
        {
            // Eski tek dosya alanını temizle (artık dosyalar ayrı tabloda)
            kayit.DosyaYolu = string.Empty;

            _context.Uygunsuzluklar.Add(kayit);
            await _context.SaveChangesAsync();

            // Çoklu dosya işleme
            if (ekBelgeler != null && ekBelgeler.Count > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "dokumanlar");
                Directory.CreateDirectory(uploadsFolder);

                foreach (var dosya in ekBelgeler)
                {
                    if (dosya.Length == 0) continue;

                    // Boyut kontrolü
                    if (dosya.Length > MaxDosyaBoyutu)
                    {
                        return BadRequest($"'{dosya.FileName}' dosyası 10 MB sınırını aşıyor.");
                    }

                    // Uzantı kontrolü (her dosya için ayrı ayrı)
                    var uzanti = Path.GetExtension(dosya.FileName).ToLowerInvariant();
                    if (string.IsNullOrEmpty(uzanti) || !IzinVerilenUzantilar.Contains(uzanti))
                    {
                        return BadRequest($"Geçersiz dosya formatı: '{dosya.FileName}'. İzin verilen formatlar: {string.Join(", ", IzinVerilenUzantilar)}");
                    }

                    // Eşsiz dosya adı üret ve kaydet
                    var benzersizAd = $"{Guid.NewGuid()}{uzanti}";
                    var tamYol = Path.Combine(uploadsFolder, benzersizAd);

                    using (var stream = new FileStream(tamYol, FileMode.Create))
                    {
                        await dosya.CopyToAsync(stream);
                    }

                    // Yeni tabloya dosya kaydı ekle
                    _context.UygunsuzlukDosyalari.Add(new UygunsuzlukDosya
                    {
                        DosyaYolu = $"/uploads/dokumanlar/{benzersizAd}",
                        UygunsuzlukId = kayit.Id
                    });
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetUygunsuzluklar), new { id = kayit.Id }, kayit);
        }

        // 3. SİLME (DELETE) - Profesyonel Soft Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> UygunsuzlukSil(int id)
        {
            var silinecekKayit = await _context.Uygunsuzluklar.FindAsync(id);
            
            if (silinecekKayit == null) 
            {
                return NotFound("Silinecek kayıt bulunamadı.");
            }

            // DİKKAT: Kaydı veritabanından tamamen uçurmuyoruz, arşive alıyoruz!
            silinecekKayit.SilindiMi = true; 
            
            await _context.SaveChangesAsync();
            return Ok("Kayıt başarıyla arşive kaldırıldı.");
        }
    }
}