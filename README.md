# 🏗️ ERN Enerji - Saha Uygunsuzluk Yönetim Sistemi (Alt Modül)

Bu proje, şantiye ve saha alanlarında tespit edilen iş sağlığı ve güvenliği (İSG) veya yapısal uygunsuzlukların, personeller tarafından mobil cihazlar üzerinden anlık olarak fotoğraflı bir şekilde sisteme kaydedilmesini ve yönetilmesini sağlayan bir modüldür. ERN Enerji'nin mevcut dijital altyapısına entegre edilmek üzere tam yığın (full-stack) olarak geliştirilmiştir.

## ✨ Öne Çıkan Özellikler

* **Güvenli Kimlik Doğrulama:** SHA256 şifreleme altyapısı ile güvenli personel girişi ve hatalı girişlerde modern uyarı sistemi (401 Unauthorized yönetimi).
* **Fotoğraflı Tespit:** Saha personellerinin cihaz kamerasını veya galerisini kullanarak uygunsuzluk anını fotoğraflaması ve kaydetmesi.
* **İlişkisel Veri Yönetimi:** Her uygunsuzluk kaydının, o kaydı açan personelin sistemdeki ID'si (OlusturanKullaniciId) ile ilişkili olarak tutulması.
* **Modern UI/UX Tasarım:** Kullanıcı dostu arayüz, özel tasarım hata modalları ve şirket kurumsal kimliğine uygun renk paleti.

## 🛠️ Kullanılan Teknolojiler

**Frontend (Mobil Arayüz):**
* React Native (Expo)
* Expo Router (Sayfa yönlendirmeleri)
* StyleSheet / Flexbox (Arayüz tasarımı)

**Backend (API Servisi):**
* .NET Core 8 Web API
* Entity Framework Core (Code-First yaklaşımı)
* C# Cryptography (SHA256 Şifreleme)

**Veritabanı:**
* PostgreSQL

---

## ⚙️ Modül Entegrasyonu ve Geliştirici Notları

Bu proje, bağımsız bir uygulama olmaktan ziyade, ERN Enerji'nin mevcut ana mobil uygulamasına ve backend sistemine bir **alt modül (sub-module)** olarak entegre edilmek üzere tasarlanmıştır. Sisteme tak-çalıştır mantığıyla eklenebilecek bir yapıda kurgulanmıştır.

### 1. Backend Entegrasyonu (API & Database)
* **Controller Taşınması:** Modül içerisindeki `AuthController` ve `UygunsuzlukController` dosyaları, ana projenin API katmanına doğrudan eklenebilir.
* **Veritabanı Birleştirme:** Modül içindeki `Uygunsuzluklar` tablosu (Code-First), ana sistemin `DbContext` yapısına `DbSet<UygunsuzlukKaydi>` olarak dahil edilmelidir. Veritabanı güncellemeleri (Migration) ana proje üzerinden yürütülmelidir.
* **Kullanıcı İlişkisi:** Ana sistemdeki mevcut personel ID yapısı, bu modüldeki `OlusturanKullaniciId` (Foreign Key) ile doğrudan eşleşecek şekilde tasarlanmıştır. Özel bir eşleştirme tablosuna gerek yoktur.

### 2. Frontend Entegrasyonu (Mobil Ekranlar)
* **Sayfa Yönlendirmeleri:** `fronted/app/` altındaki sayfalar (Login ve Uygunsuzluk Listesi/Ekleme ekranları), ana uygulamanın navigasyon yapısına (React Navigation veya Expo Router) modüler ekranlar olarak entegre edilebilir.
* **API İstekleri:** Uygulama içindeki `fetch` ile atılan API isteklerinde yer alan geliştirme (localhost/lokal IP) adresleri, entegrasyon aşamasında şirketin ana API gateway veya production sunucu adresleriyle güncellenmelidir.

---

## 📝 Kurumsal Staj Projesi Notu
Bu modül, yazılım geliştirme süreçlerini (Frontend, Backend, Veritabanı, Güvenlik) uçtan uca pratik etmek ve ERN Enerji'nin dijital dönüşüm süreçlerine katkı sağlamak amacıyla bir staj projesi kapsamında geliştirilmiştir.