using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Data;
using UygunsuzlukBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace UygunsuzlukBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UygunsuzlukDbContext _context;

        public AuthController(UygunsuzlukDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(Kullanici request)
        {
            if (await _context.Kullanicilar.AnyAsync(u => u.KullaniciAd == request.KullaniciAd))
            {
                return BadRequest(new { mesaj = "Bu kullanıcı adı zaten mevcut!" });
            }

            request.SifreHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.SifreHash)));
            
            _context.Kullanicilar.Add(request);
            await _context.SaveChangesAsync();
            
            return Ok(new { mesaj = "Kullanıcı başarıyla oluşturuldu!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(Kullanici request)
        {
            var user = await _context.Kullanicilar.FirstOrDefaultAsync(u => u.KullaniciAd == request.KullaniciAd);
            
            if (user == null) 
            {
                return Unauthorized(new { mesaj = "Kullanıcı adı veya şifre hatalı!" });
            }

            var loginSifreHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.SifreHash)));
            
            if (user.SifreHash != loginSifreHash) 
            {
                return Unauthorized(new { mesaj = "Kullanıcı adı veya şifre hatalı!" });
            }

            // DÜZELTİLEN KISIM BURASI: Artık sayısal Id döndürüyoruz
            return Ok(new { 
                mesaj = "Giriş başarılı!", 
                kullaniciId = user.Id, 
                kullaniciAd = user.KullaniciAd 
            });
        }
    }
}