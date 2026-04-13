using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Data;
using System.Text.Json.Serialization; // YENİ EKLENDİ: JSON döngü kuralı için gerekli kütüphane

var builder = WebApplication.CreateBuilder(args);

// 1. PostgreSQL Veritabanı Bağlantısını Sisteme Tanıtıyoruz
builder.Services.AddDbContext<UygunsuzlukDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Uygulamanın diğer standart servisleri
// YENİ EKLENDİ: Sonsuz döngüye girmeyi engelleyen IgnoreCycles kuralı
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // API'mizi tarayıcıdan test etmek için

// 3. CORS ayarları (Frontend'in backend'e erişebilmesi için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// 4. HTTP istek boru hattı (Pipeline) ayarları
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll"); // CORS'u tek seferde burada çağırmak yeterli
app.UseStaticFiles(); // wwwroot/uploads altındaki dosyalara erişim
//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();