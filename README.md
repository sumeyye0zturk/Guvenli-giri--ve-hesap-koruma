# Güvenli Giriş ve Hesap Koruma Sistemi

Node.js ve Express.js kullanılarak geliştirilen bu proje, kullanıcı kaydı ve giriş işlemlerini gerçekleştiren, hatalı giriş denemelerini izleyen ve belirlenen sınır aşıldığında hesabı kilitleyen **eğitim amaçlı bir kimlik doğrulama uygulamasıdır**.

## Projenin Amacı

Projenin amacı, temel kullanıcı doğrulama süreçlerini ve hesap koruma mekanizmalarını uygulamalı olarak göstermektir. Kullanıcı kayıtları, parola kontrolü, başarısız giriş denemelerinin sayılması ve işlem kayıtlarının tutulması bu kapsamda ele alınmıştır.

## Özellikler

- **Kullanıcı kaydı:** Kullanıcı adı ve parola ile kayıt oluşturma.
- **Tekrarlanan kullanıcı adı kontrolü:** Aynı kullanıcı adıyla ikinci kayıt oluşturulmasını engelleme.
- **Parola kuralları:** En az 8 karakter; en az bir büyük harf, küçük harf, rakam ve `@$!%*?&` karakterlerinden biri.
- **Parola özeti:** Parolaları düz metin yerine SHA-256 özeti olarak saklama.
- **Giriş doğrulama:** Kullanıcı adı ve parola özeti karşılaştırması.
- **Hatalı giriş sayacı:** Başarısız giriş denemelerini kullanıcı bazında izleme.
- **Hesap kilitleme:** Üç hatalı parola denemesinden sonra hesabı kilitleme.
- **Başarılı girişte sayaç sıfırlama:** Başarılı doğrulama sonrasında hatalı deneme sayısını sıfırlama.
- **İşlem kayıtları:** Kayıt, giriş ve hesap kilitleme gibi olayları `logs.txt` dosyasına yazma.

## Kullanılan Teknolojiler

| Teknoloji | Kullanım amacı |
| --- | --- |
| Node.js | Sunucu tarafı JavaScript çalışma ortamı |
| Express.js | HTTP sunucusu ve API uç noktaları |
| JavaScript | Uygulama mantığı |
| Node.js `crypto` | SHA-256 parola özeti oluşturma |
| Node.js `fs` | JSON dosyası ve günlük kayıtlarıyla çalışma |
| HTML/CSS/JavaScript | `public/` klasöründeki istemci arayüzü |

## Kurulum ve Çalıştırma

Bilgisayarınızda **Node.js ve npm** kurulu olmalıdır.

**1. Depoyu klonlayın:**

```bash
git clone https://github.com/sumeyye0zturk/Guvenli-Giris-Ve-Hesap-Koruma-Sistemi.git
cd Guvenli-Giris-Ve-Hesap-Koruma-Sistemi
```

**2. Bağımlılıkları yükleyin:**

```bash
npm install
```

**3. Sunucuyu başlatın:**

```bash
node server.js
```

**4. Tarayıcıdan uygulamayı açın:**

http://localhost:3000

## Sistem Nasıl Çalışır?

### Kayıt işlemi

1. Kullanıcı, kullanıcı adı ve parolasını girer.
2. Boş alanlar ve aynı kullanıcı adının daha önce kaydedilip kaydedilmediği kontrol edilir.
3. Parolanın belirlenen karmaşıklık kurallarına uygunluğu doğrulanır.
4. Parolanın SHA-256 özeti oluşturulur ve kullanıcı bilgileri `users.json` dosyasına kaydedilir.
5. Kayıt işlemi günlük dosyasına eklenir.

### Giriş ve hesap koruma

1. Kullanıcının sistemde kayıtlı olup olmadığı kontrol edilir.
2. Hesap kilitliyse giriş reddedilir.
3. Girilen parolanın özeti kayıtlı özetle karşılaştırılır.
4. Parola doğruysa giriş başarılı olur ve hatalı deneme sayacı sıfırlanır.
5. Parola yanlışsa sayaç artırılır. Üçüncü hatalı denemede hesap kilitlenir.
6. İlgili olaylar `logs.txt` dosyasına kaydedilir.

> **Not:** Mevcut uygulamada kilitlenen hesapları otomatik açan veya parola sıfırlayan bir uç nokta bulunmamaktadır.

## API Uç Noktaları

| Yöntem | Uç nokta | Açıklama |
| --- | --- | --- |
| POST | `/register` | Yeni kullanıcı kaydı oluşturur |
| POST | `/login` | Kullanıcı bilgilerini doğrular ve giriş denemelerini yönetir |

**Örnek kayıt isteği:**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ornek_kullanici","password":"Ornek123!"}'
```

**Örnek giriş isteği:**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ornek_kullanici","password":"Ornek123!"}'
```

API yanıtları `success` ve `message` alanlarını içeren JSON nesneleridir.

## Proje Dosyaları

```text
Guvenli-Giris-Ve-Hesap-Koruma-Sistemi/
├── public/                 # İstemci arayüzü dosyaları
├── server.js               # Express sunucusu ve kimlik doğrulama işlemleri
├── package.json            # Proje bilgileri ve bağımlılıklar
├── package-lock.json       # Bağımlılık kilit dosyası
├── users.json              # Kullanıcı kayıtları ve giriş sayaçları
├── logs.txt                # İşlem kayıtları
├── READme.txt              # Mevcut kısa çalıştırma açıklaması
├── Guvenli-Login-ve-Hesap-Koruma-Sistemi.pptx
├── GÜVENLİ GİRİŞ VE HESAP KORUMA SİSTEMİ.pdf
└── README.md               # Bu dokümantasyon
```

## Güvenlik Notları

Bu proje, kimlik doğrulama ve hesap kilitleme mantığını öğrenmek amacıyla geliştirilmiştir; **üretim ortamında kullanıma hazır bir güvenlik çözümü değildir**.

- SHA-256 hızlı bir özet algoritmasıdır; parola saklamak için tek başına uygun değildir. Gerçek uygulamalarda **Argon2id**, **scrypt** veya **bcrypt** gibi parolaya özel, tuzlama kullanan yöntemler tercih edilmelidir.
- Kullanıcı bilgilerinin JSON dosyasında saklanması, eşzamanlı erişim ve veri yönetimi açısından sınırlıdır.
- Hesap kilitleme mekanizması, ek korumalar olmadan kötüye kullanılarak kullanıcıların hesaplarının kilitlenmesine yol açabilir.
- Mevcut kodda oturum yönetimi, çok faktörlü doğrulama ve parola sıfırlama akışı bulunmamaktadır.
- Gerçek kullanıcı verileri, parola özetleri ve işlem günlükleri herkese açık depolara yüklenmemelidir. `users.json` ve `logs.txt` dosyaları için uygun gizlilik ve `.gitignore` düzenlemeleri yapılmalıdır.

## Geliştirme Önerileri

- Parola saklama mekanizmasını Argon2id veya bcrypt ile güncelleme.
- Veritabanı entegrasyonu ve güvenli oturum yönetimi ekleme.
- Hesap kilidini güvenli şekilde kaldırma ve parola sıfırlama akışı geliştirme.
- İstek sınırlama (rate limiting) ve ek giriş güvenliği kontrolleri ekleme.
- Otomatik testler ve yapılandırılabilir ortam değişkenleri kullanma.

## Proje Bağlantısı

[GitHub deposunu görüntüle](https://github.com/sumeyye0zturk/Guvenli-Giris-Ve-Hesap-Koruma-Sistemi)
