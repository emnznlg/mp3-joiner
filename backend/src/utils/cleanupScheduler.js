const fs = require("fs");
const path = require("path");
const { cleanupFiles } = require("./fileUtils");

class CleanupScheduler {
  constructor() {
    // Temizlenecek dizinler
    this.directories = [
      path.join(process.cwd(), "temp"),
      path.join(process.cwd(), "uploads"),
    ];

    // Dosya yaşı sınırı (1 saat)
    this.maxAge = 60 * 60 * 1000;
  }

  /**
   * Temizleme işlemini başlatır
   */
  start() {
    // Her 15 dakikada bir temizlik yap
    setInterval(() => this.cleanup(), 15 * 60 * 1000);
    console.log("Dosya temizleme mekanizması başlatıldı");
  }

  /**
   * Temizleme işlemini gerçekleştirir
   */
  cleanup() {
    const now = Date.now();

    this.directories.forEach((directory) => {
      if (!fs.existsSync(directory)) {
        return;
      }

      fs.readdir(directory, (err, files) => {
        if (err) {
          console.error(`Dizin okuma hatası (${directory}):`, err);
          return;
        }

        const filePaths = files.map((file) => path.join(directory, file));
        const oldFiles = filePaths.filter((filePath) => {
          try {
            const stats = fs.statSync(filePath);
            const age = now - stats.mtimeMs;
            return age > this.maxAge;
          } catch (error) {
            console.error(`Dosya kontrol hatası (${filePath}):`, error);
            return false;
          }
        });

        if (oldFiles.length > 0) {
          cleanupFiles(oldFiles);
          console.log(`${oldFiles.length} eski dosya temizlendi`);
        }
      });
    });
  }

  /**
   * Belirli bir dizindeki tüm dosyaları temizler
   * @param {string} directory - Temizlenecek dizin
   */
  cleanDirectory(directory) {
    if (!fs.existsSync(directory)) {
      return;
    }

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error(`Dizin okuma hatası (${directory}):`, err);
        return;
      }

      const filePaths = files.map((file) => path.join(directory, file));
      cleanupFiles(filePaths);
      console.log(`${directory} dizini temizlendi`);
    });
  }
}

module.exports = new CleanupScheduler();
