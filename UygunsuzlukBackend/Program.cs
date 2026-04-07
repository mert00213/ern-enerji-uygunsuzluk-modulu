using Microsoft.EntityFrameworkCore;
using UygunsuzlukBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. PostgreSQL Veritabanı Bağlantısını Sisteme Tanıtıyoruz
builder.Services.AddDbContext<UygunsuzlukDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Uygulamanın diğer standart servisleri
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // API'mizi tarayıcıdan test etmek için

var app = builder.Build();

// 3. HTTP istek boru hattı (Pipeline) ayarları
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();