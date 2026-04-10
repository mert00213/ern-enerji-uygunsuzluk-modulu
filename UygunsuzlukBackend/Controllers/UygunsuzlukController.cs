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

        public UygunsuzlukController(UygunsuzlukDbContext context)
        {
            _context = context;
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
                    k.CozulduMu,
                    EkleyenKisi = k.OlusturanKullanici != null ? k.OlusturanKullanici.KullaniciAd : null
                })
                .ToListAsync();

            return Ok(sonuc);
        }

        // 2. EKLEME (POST) - AYNEN KALIYOR
        [HttpPost]
        public async Task<ActionResult<UygunsuzlukKaydi>> PostUygunsuzluk(UygunsuzlukKaydi kayit)
        {
            _context.Uygunsuzluklar.Add(kayit);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUygunsuzluklar), new { id = kayit.Id }, kayit);
        }

        // 3. SİLME (DELETE) - YENİ EKLENDİ (Profesyonel Soft Delete)
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