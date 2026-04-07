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
        public async Task<ActionResult<Kullanici>> Register(Kullanici request)
        {
            request.SifreHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.SifreHash)));
            _context.Kullanicilar.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new { mesaj = "Kullanici basariyla olusturuldu!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(Kullanici request)
        {
            var user = await _context.Kullanicilar.FirstOrDefaultAsync(u => u.KullaniciAd == request.KullaniciAd);
            if (user == null) return BadRequest(new { mesaj = "Kullanici bulunamadi." });

            var loginSifreHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.SifreHash)));
            if (user.SifreHash != loginSifreHash) return BadRequest(new { mesaj = "Hatali sifre!" });

            return Ok(new { mesaj = "Giris basarili!" });
        }
    }
}