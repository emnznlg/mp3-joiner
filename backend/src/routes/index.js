const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  generateUniqueFileName,
  isValidMp3File,
  isValidFileCount,
} = require("../utils/fileUtils");

const router = express.Router();

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFileName(file.originalname));
  },
});

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  if (!isValidMp3File(file)) {
    cb(new Error("Sadece MP3 dosyaları kabul edilir."), false);
    return;
  }
  cb(null, true);
};

// Multer middleware'i
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 50, // Maksimum dosya sayısı
  },
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: MP3 dosyalarını yükle ve birleştir
 *     description: Birden fazla MP3 dosyasını yükler ve tek bir MP3 dosyasında birleştirir
 *     tags: [MP3]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *         description: Yüklenecek MP3 dosyaları (1-50 arası)
 *       - in: formData
 *         name: silenceAfter
 *         type: array
 *         items:
 *           type: integer
 *         required: false
 *         description: Sessizlik eklenecek dosya indeksleri
 *       - in: formData
 *         name: outputFileName
 *         type: string
 *         required: false
 *         description: Birleştirilmiş dosyanın adı (3-50 karakter, özel karakter içeremez)
 *     responses:
 *       200:
 *         description: Dosyalar başarıyla yüklendi ve birleştirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Geçersiz istek
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    // Dosya sayısı kontrolü
    if (!req.files || !isValidFileCount(req.files.length)) {
      return res.status(400).json({
        error: "En az 1, en fazla 50 dosya yükleyebilirsiniz.",
      });
    }

    // Sessizlik eklenecek dosya indekslerini al
    const silenceAfter = req.body.silenceAfter
      ? JSON.parse(req.body.silenceAfter)
      : [];

    // Sessizlik indekslerini doğrula
    if (
      !Array.isArray(silenceAfter) ||
      !silenceAfter.every(
        (index) =>
          Number.isInteger(index) && index >= 0 && index < req.files.length
      )
    ) {
      return res.status(400).json({
        error: "Geçersiz sessizlik indeksleri.",
      });
    }

    // Çıktı dosyası adını al
    const outputFileName = req.body.outputFileName || "";

    // Upload controller'a yönlendir
    const uploadController = require("../controllers/uploadController");
    const result = await uploadController.handleUpload(
      req.files,
      silenceAfter,
      outputFileName
    );

    res.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Dosya yükleme sırasında bir hata oluştu.",
    });
  }
});

/**
 * @swagger
 * /download/{filename}:
 *   get:
 *     summary: Birleştirilmiş MP3 dosyasını indir
 *     description: Belirtilen dosya adına sahip birleştirilmiş MP3 dosyasını indirir
 *     tags: [MP3]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: İndirilecek dosyanın adı
 *     responses:
 *       200:
 *         description: MP3 dosyası
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Dosya bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/download/:filename", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "temp", req.params.filename);
    res.download(filePath, "merged.mp3", (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(404).json({
            error: "Dosya bulunamadı.",
          });
        }
      }
      // Dosya indirildikten sonra temizle
      const mp3Service = require("../services/mp3Service");
      mp3Service.cleanup(filePath);
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      error: "Dosya indirme sırasında bir hata oluştu.",
    });
  }
});

module.exports = router;
