# Modern Stok Takip Sistemi

Bu proje, orijinal stok takip sisteminin Next.js ve Electron kullanılarak modernize edilmiş versiyonudur. Hem web uygulaması olarak Vercel'da çalışabilir, hem de masaüstü uygulaması olarak kullanılabilir.

## Özellikler

- Modern, çok sayfalı kullanıcı arayüzü
- Responsive tasarım
- Stok listeleme, ekleme, düzenleme, silme
- Stok hareketleri takibi
- İstatistik ve grafikler
- Filtreler ve arama özellikleri
- MongoDB bağlantısı

## Kurulum

### Gereksinimleri

- Node.js 16 veya üzeri
- MongoDB veritabanı
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/stok_takip_modern.git
cd stok_takip_modern
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env.local` dosyası oluşturun ve MongoDB bağlantı bilgilerinizi ekleyin:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/stok_takip?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Geliştirme modunda çalıştırın:
```bash
# Web uygulaması olarak
npm run dev

# Electron uygulaması olarak
npm run electron-dev
```

## Build Alma

### Web Uygulaması (Vercel)

```bash
npm run build
```

### Masaüstü Uygulaması (Electron)

```bash
npm run electron-pack
```

Bu komut `dist` klasöründe Windows için kurulum dosyası oluşturacaktır.

## Teknolojiler

- Next.js
- React
- TypeScript
- Tailwind CSS
- Electron
- MongoDB
- Chart.js

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
