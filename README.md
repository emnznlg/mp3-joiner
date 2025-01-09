# MP3 Joiner

MP3 dosyalarını birleştirme uygulaması.

## Project Structure

```
mp3-joiner/
├── backend/             # Backend application
│   ├── node_modules/    # Node.js packages
│   ├── src/            # Source code
│   │   ├── controllers/  # HTTP endpoint controllers
│   │   ├── routes/      # API route definitions
│   │   ├── services/    # Business logic services
│   │   ├── utils/       # Helper functions
│   │   └── index.js     # Application entry point
│   ├── temp/          # Temporary files
│   ├── uploads/       # Uploaded MP3 files
│   └── package.json   # Backend dependencies
├── frontend/          # Frontend application
│   ├── src/
│   │   ├── components/  # UI components
│   │   │   ├── ui/       # Base UI components
│   │   │   ├── forms/    # Form components
│   │   │   └── layout/   # Layout components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API services
│   │   ├── store/      # State management
│   │   ├── types/      # TypeScript types
│   │   ├── utils/      # Helper functions
│   │   └── pages/      # Page components
│   └── package.json   # Frontend dependencies
└── README.md         # Project documentation
```

## Technologies

### Backend

- Node.js
- Express.js
- Multer (File upload)
- fluent-ffmpeg (MP3 processing)
- CORS
- Swagger UI (API Documentation)

### Frontend

- React + TypeScript
- Vite (Build tool)
- Tailwind CSS (UI Framework)
- Zustand (State Management)
- React Hook Form (Form Management)
- React Dropzone (File Upload)
- dnd-kit (Drag & Drop)
- Axios (HTTP Client)
- Radix UI (UI Components)
- clsx & tailwind-merge (Utility)

## Installation

### Backend

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

### Frontend

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm run dev
```

## Özellikler

### Backend

- Çoklu MP3 dosya yükleme (1-50 arası)
- Dosya format kontrolü (.mp3)
- Dosya metadata okuma (süre, boyut, bit rate)
- MP3 birleştirme
- Seçili dosyalardan sonra sessizlik ekleme (1 saniye)
- Otomatik dosya temizleme
- Hata yönetimi
- CORS desteği
- RESTful API
- API dokümantasyonu (Swagger UI)

### Frontend

- Modern ve responsive tasarım
- Sürükle-bırak dosya yükleme
- Dosya sıralama ve yeniden sıralama
- Dosya silme
- Dosya bazlı sessizlik ekleme seçenekleri
- Yükleme ilerleme takibi
- Dosya önizleme (boyut, isim)
- İndirme yönetimi
- Hata/başarı bildirimleri
- Klavye navigasyon desteği

## API Dokümantasyonu

API dokümantasyonuna şu adresten erişebilirsiniz:

```
http://localhost:3000/api-docs
```

### API Endpoints

1. **POST /api/upload**

   - MP3 dosyalarını yükle ve birleştir
   - Content-Type: multipart/form-data
   - Parametreler:
     - files: MP3 dosyaları (1-50 arası)
     - silenceAfter: Sessizlik eklenecek dosya indeksleri (opsiyonel)

2. **GET /api/download/{filename}**
   - Birleştirilmiş MP3 dosyasını indir
   - İndirme sonrası otomatik temizleme

### Örnek Yanıt

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
    "filename": "1704823456789-1234.mp3",
    "size": 5.24,
    "duration": 180,
    "bitRate": 192,
    "downloadUrl": "/api/download/1704823456789-1234.mp3"
  }
}
```

## Kısıtlamalar

- Minimum dosya sayısı: 1
- Maksimum dosya sayısı: 50
- Desteklenen format: MP3
- Dosya önizleme özellikleri: Süre, boyut, bit rate
- Sessizlik süresi: 1 saniye (sabit)
