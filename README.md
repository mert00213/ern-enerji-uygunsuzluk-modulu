# 🏗️ Ern Enerji - Şantiye Uygunsuzluk Takip Modülü

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![.NET 8](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Bu proje, **Ern Enerji** portalına entegre edilmek üzere geliştirilmiş kapsamlı bir şantiye uygunsuzluk (tespit ve takip) modülüdür. Sahadaki personelin karşılaştığı kalite veya iş güvenliği ihlallerini (örneğin: açıkta bırakılan demir filizleri, yalıtım hataları vb.) mobil cihazlar üzerinden anında sisteme kaydetmesini ve bu süreçlerin merkezden yönetilmesini sağlar.

---

## ✨ Öne Çıkan Özellikler

- 📸 **Mobil Kayıt:** Sahadan anlık olarak uygunsuzluk fotoğrafı çekme veya galeriye erişim.
- 📝 **Detaylı Raporlama:** Tespit edilen soruna ait başlık, açıklama ve tarih bilgilerinin sisteme girilmesi.
- ✅ **Durum Takibi:** Kaydedilen uygunsuzlukların "Çözüldü" veya "Çözülmedi" (Aktif) olarak durumlarının güncellenebilmesi.
- ⚡ **Yüksek Performans:** .NET 8.0 Web API ile hızlı yanıt süreleri ve güvenli veri aktarımı.

---

## 🛠 Kullanılan Teknolojiler

Proje, "Separation of Concerns" (Sorumlulukların Ayrılması) prensibine uygun olarak Frontend ve Backend olmak üzere iki ayrı mimaride tasarlanmıştır.

### Ön Yüz (Frontend)
- **Framework:** React Native (Expo)
- **Dil:** TypeScript
- **Kullanım:** iOS ve Android uyumlu mobil arayüz.

### Arka Uç (Backend)
- **Framework:** ASP.NET Core Web API (.NET 8.0)
- **Dil:** C#
- **ORM:** Entity Framework Core
- **Veritabanı:** PostgreSQL

---

## 📂 Proje Klasör Yapısı

```text
ern-enerji-uygunsuzluk-modulu/
│
├── fronted/                 # React Native (Expo) Mobil Uygulama Dosyaları
│   ├── assets/              # Uygulama içi görseller ve ikonlar
│   ├── App.tsx              # Uygulamanın ana giriş noktası
│   └── package.json         # Frontend bağımlılıkları
│
└── UygunsuzlukBackend/      # .NET 8 Web API Dosyaları
    ├── Controllers/         # API uç noktaları (Gelen istekleri karşılayan kısım)
    ├── Models/              # Veritabanı tablolarının C# nesne karşılıkları (Örn: Uygunsuzluk
