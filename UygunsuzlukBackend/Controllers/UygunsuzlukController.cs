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
                    EkleyenKisi = k.OlusturanKullanici != null ? k.OlusturanKullanici.KullaniciAd : null
                })
                .ToListAsync();

            return Ok(sonuc);
        }

        // 2. EKLEME (POST) - FormData ile Dosya Yükleme Destekli
        [HttpPost]
        [RequestSizeLimit(MaxDosyaBoyutu)]
        public async Task<ActionResult<UygunsuzlukKaydi>> PostUygunsuzluk([FromForm] UygunsuzlukKaydi kayit, IFormFile? ekDosya)
        {
            if (ekDosya != null && ekDosya.Length > 0)
            {
                // 1. Dosya boyutu kontrolü
                if (ekDosya.Length > MaxDosyaBoyutu)
                {
                    return BadRequest("Dosya boyutu 10 MB'ı aşamaz.");
                }

                // 2. Uzantı kontrolü (sunucu tarafı güvenlik)
                var uzanti = Path.GetExtension(ekDosya.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(uzanti) || !IzinVerilenUzantilar.Contains(uzanti))
                {
                    return BadRequest($"Geçersiz dosya formatı: '{uzanti}'. İzin verilen formatlar: {string.Join(", ", IzinVerilenUzantilar)}");
                }

                // 3. Kayıt klasörünü oluştur
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "dokumanlar");
                Directory.CreateDirectory(uploadsFolder);

                // 4. Eşsiz dosya adı üret (Guid) ve kaydet
                var benzersizAd = $"{Guid.NewGuid()}{uzanti}";
                var tamYol = Path.Combine(uploadsFolder, benzersizAd);

                using (var stream = new FileStream(tamYol, FileMode.Create))
                {
                    await ekDosya.CopyToAsync(stream);
                }

                // 5. Veritabanına kaydedilecek göreli yolu ata
                kayit.DosyaYolu = $"/uploads/dokumanlar/{benzersizAd}";
            }

            _context.Uygunsuzluklar.Add(kayit);
            await _context.SaveChangesAsync();
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