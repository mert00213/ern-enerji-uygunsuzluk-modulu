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

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();