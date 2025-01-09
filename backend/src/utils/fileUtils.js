const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

// ffmpeg yolunu ayarla
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * MP3 dosyasının geçerli olup olmadığını kontrol eder
 * @param {Express.Multer.File} file - Yüklenen dosya
 * @returns {boolean} Dosya geçerli mi?
 */
const isValidMp3File = (file) => {
  const validMimeTypes = ["audio/mpeg", "audio/mp3"];
  const validExtensions = [".mp3"];

  const mimeTypeValid = validMimeTypes.includes(file.mimetype);
  const extensionValid = validExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );

  return mimeTypeValid && extensionValid;
};

/**
 * Dosya sayısının limitlere uygun olup olmadığını kontrol eder
 * @param {number} fileCount - Dosya sayısı
 * @returns {boolean} Dosya sayısı uygun mu?
 */
const isValidFileCount = (fileCount) => {
  const MIN_FILES = 1;
  const MAX_FILES = 50;
  return fileCount >= MIN_FILES && fileCount <= MAX_FILES;
};

/**
 * MP3 dosyasının metadata bilgilerini alır
 * @param {string} filePath - Dosya yolu
 * @returns {Promise<Object>} Metadata bilgileri
 */
const getMp3Metadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration;
      const size = metadata.format.size;
      const bitRate = metadata.format.bit_rate;

      resolve({
        duration: Math.round(duration), // saniye cinsinden
        size: Math.round((size / 1024 / 1024) * 100) / 100, // MB cinsinden, 2 ondalık
        bitRate: Math.round(bitRate / 1000), // kbps cinsinden
      });
    });
  });
};

/**
 * Geçici dosyaları temizler
 * @param {string[]} filePaths - Temizlenecek dosya yolları
 */
const cleanupFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

/**
 * Benzersiz dosya adı oluşturur
 * @param {string} originalName - Orijinal dosya adı
 * @returns {string} Benzersiz dosya adı
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = path.extname(originalName);
  return `${timestamp}-${random}${ext}`;
};

module.exports = {
  isValidMp3File,
  isValidFileCount,
  getMp3Metadata,
  cleanupFiles,
  generateUniqueFileName,
};
