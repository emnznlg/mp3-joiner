const mp3Service = require("../services/mp3Service");
const { getMp3Metadata, cleanupFiles } = require("../utils/fileUtils");
const path = require("path");

// Dosya adı validasyonu için yardımcı fonksiyon
function isValidFileName(fileName) {
  // Boş veya undefined ise geçerli (varsayılan isim kullanılacak)
  if (!fileName) return true;

  // Sadece harf, rakam, tire, alt çizgi ve nokta içerebilir
  const validNameRegex = /^[a-zA-Z0-9-_.]+$/;
  // Uzunluk kontrolü (3-50 karakter)
  return (
    fileName.length >= 3 &&
    fileName.length <= 50 &&
    validNameRegex.test(fileName)
  );
}

class UploadController {
  /**
   * Yüklenen dosyaları işler ve birleştirir
   * @param {Express.Multer.File[]} files - Yüklenen dosyalar
   * @param {number[]} silenceAfterIndices - Sessizlik eklenecek dosya indeksleri
   * @param {string} [outputFileName] - Çıktı dosyası adı (opsiyonel)
   * @returns {Promise<Object>} İşlem sonucu
   */
  async handleUpload(files, silenceAfterIndices = [], outputFileName = "") {
    const uploadedFiles = [];
    const filePaths = [];

    try {
      // Dosya adı validasyonu
      if (outputFileName && !isValidFileName(outputFileName)) {
        throw new Error(
          "Geçersiz dosya adı. Sadece harf, rakam, tire, alt çizgi ve nokta kullanabilirsiniz (3-50 karakter)."
        );
      }

      // Dosya bilgilerini topla
      for (const file of files) {
        const filePath = file.path;
        filePaths.push(filePath);

        const metadata = await getMp3Metadata(filePath);
        uploadedFiles.push({
          originalName: file.originalname,
          size: metadata.size,
          duration: metadata.duration,
          bitRate: metadata.bitRate,
          silenceAfter: silenceAfterIndices.includes(uploadedFiles.length),
        });
      }

      // Dosyaları birleştir
      const mergedFilePath = await mp3Service.mergeMp3Files(
        filePaths,
        silenceAfterIndices,
        outputFileName
      );
      const mergedMetadata = await getMp3Metadata(mergedFilePath);

      // Sonuç nesnesini oluştur
      const result = {
        status: "success",
        message: "MP3 dosyaları başarıyla birleştirildi",
        files: uploadedFiles,
        result: {
          filename: path.basename(mergedFilePath),
          size: mergedMetadata.size,
          duration: mergedMetadata.duration,
          bitRate: mergedMetadata.bitRate,
          downloadUrl: `/api/download/${path.basename(mergedFilePath)}`,
        },
      };

      return result;
    } catch (error) {
      // Hata durumunda dosyaları temizle
      cleanupFiles(filePaths);
      throw error;
    }
  }
}

module.exports = new UploadController();
