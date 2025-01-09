const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { generateUniqueFileName, cleanupFiles } = require("../utils/fileUtils");

class Mp3Service {
  /**
   * 1 saniyelik sessizlik MP3'i oluşturur
   * @returns {Promise<string>} Oluşturulan sessizlik dosyasının yolu
   */
  async createSilence() {
    try {
      const outputFileName = generateUniqueFileName("silence.mp3");
      const outputPath = path.join(process.cwd(), "temp", outputFileName);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input("anullsrc")
          .inputFormat("lavfi")
          .duration(1)
          .audioCodec("libmp3lame")
          .audioBitrate("192k")
          .on("error", (err) => {
            cleanupFiles([outputPath]);
            reject(new Error(`Sessizlik oluşturma hatası: ${err.message}`));
          })
          .on("end", () => {
            resolve();
          })
          .save(outputPath);
      });

      return outputPath;
    } catch (error) {
      throw error;
    }
  }

  /**
   * MP3 dosyalarını birleştirir ve seçili dosyalardan sonra sessizlik ekler
   * @param {string[]} inputFiles - Birleştirilecek dosya yolları
   * @param {number[]} silenceAfterIndices - Sessizlik eklenecek dosya indeksleri
   * @param {string} [outputFileName] - Çıktı dosyası adı (opsiyonel)
   * @returns {Promise<string>} Birleştirilmiş dosyanın yolu
   */
  async mergeMp3Files(
    inputFiles,
    silenceAfterIndices = [],
    outputFileName = ""
  ) {
    try {
      // Çıktı dosyası için isim oluştur
      const finalFileName = outputFileName
        ? `${outputFileName}.mp3`
        : generateUniqueFileName("merged.mp3");

      const outputPath = path.join(process.cwd(), "temp", finalFileName);

      // Sessizlik dosyasını oluştur
      const silencePath = await this.createSilence();

      // Yeni dosya listesi oluştur ve sessizlikleri ekle
      const filesWithSilence = [];
      inputFiles.forEach((file, index) => {
        filesWithSilence.push(file);
        if (silenceAfterIndices.includes(index)) {
          filesWithSilence.push(silencePath);
        }
      });

      // Birleştirme işlemini başlat
      await this._mergeFiles(filesWithSilence, outputPath);

      // Sessizlik dosyasını temizle
      cleanupFiles([silencePath]);

      return outputPath;
    } catch (error) {
      // Hata durumunda giriş dosyalarını temizle
      cleanupFiles(inputFiles);
      throw error;
    }
  }

  /**
   * Dosyaları birleştirme işlemini gerçekleştirir
   * @param {string[]} inputFiles - Birleştirilecek dosya yolları
   * @param {string} outputPath - Çıktı dosyasının yolu
   * @returns {Promise<void>}
   * @private
   */
  _mergeFiles(inputFiles, outputPath) {
    return new Promise((resolve, reject) => {
      let command = ffmpeg();

      // Giriş dosyalarını ekle
      inputFiles.forEach((file) => {
        command = command.input(file);
      });

      // Birleştirme işlemini gerçekleştir
      command
        .on("error", (err) => {
          cleanupFiles([outputPath]); // Hata durumunda çıktı dosyasını temizle
          reject(new Error(`MP3 birleştirme hatası: ${err.message}`));
        })
        .on("end", () => {
          resolve();
        })
        // MP3 formatında birleştir
        .mergeToFile(outputPath, path.dirname(outputPath))
        // Ses kalitesini ayarla
        .audioCodec("libmp3lame")
        .audioBitrate("192k"); // Standart kalite
    });
  }

  /**
   * Birleştirilmiş dosyayı siler
   * @param {string} filePath - Silinecek dosya yolu
   */
  cleanup(filePath) {
    cleanupFiles([filePath]);
  }
}

module.exports = new Mp3Service();
