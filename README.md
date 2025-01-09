# MP3 Joiner

MP3 dosyalarını kolayca birleştirmenizi sağlayan modern bir web uygulaması.

## Özellikler

- Sürükle-bırak ile kolay dosya yükleme
- Birden fazla MP3 dosyasını tek bir dosyada birleştirme
- Dosyaları sürükleyerek sıralama
- Seçili dosyalardan sonra 1 saniyelik sessizlik ekleme
- Özel çıktı dosya adı belirleme
- Gerçek zamanlı ilerleme takibi
- Modern ve kullanıcı dostu arayüz
- Responsive tasarım

## Teknolojiler

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (State yönetimi)
- Axios (API istekleri)
- DND Kit (Sürükle-bırak)
- Radix UI (UI bileşenleri)
- Sonner (Toast bildirimleri)

### Backend

- Node.js + Express
- Fluent FFmpeg (MP3 işleme)
- Multer (Dosya yükleme)
- Swagger UI (API dokümantasyonu)

## Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- FFmpeg

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### POST /api/upload

MP3 dosyalarını yükler ve birleştirir.

#### Parameters

- `files`: MP3 dosyaları (multipart/form-data)
- `silenceAfter`: Sessizlik eklenecek dosya indeksleri (optional)
- `outputFileName`: Çıktı dosyası adı (optional)

#### Response

```json
{
  "status": "success",
  "message": "MP3 dosyaları başarıyla birleştirildi",
  "files": [
    {
      "originalName": "song1.mp3",
      "size": 5.24,
      "duration": 180,
      "bitRate": 192,
      "silenceAfter": true
    }
  ],
  "result": {
    "filename": "merged.mp3",
    "size": 8.39,
    "duration": 300,
    "bitRate": 192,
    "downloadUrl": "/api/download/merged.mp3"
  }
}
```

### GET /api/download/:filename

Birleştirilmiş MP3 dosyasını indirir.

## Lisans

MIT
