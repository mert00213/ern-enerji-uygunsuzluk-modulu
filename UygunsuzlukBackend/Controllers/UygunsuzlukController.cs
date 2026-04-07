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

        // Tüm uygunsuzlukları getir (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UygunsuzlukKaydi>>> GetUygunsuzluklar()
        {
            return await _context.Uygunsuzluklar.ToListAsync();
        }

        // Yeni uygunsuzluk ekle (POST)
        [HttpPost]
        public async Task<ActionResult<UygunsuzlukKaydi>> PostUygunsuzluk(UygunsuzlukKaydi kayit)
        {
            _context.Uygunsuzluklar.Add(kayit);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUygunsuzluklar), new { id = kayit.Id }, kayit);
        }
    }
}