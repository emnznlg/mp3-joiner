import { useCallback } from "react";
import { Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { FileUpload } from "../components/forms/file-upload";
import { FileList } from "../components/forms/file-list";
import { FileProgress } from "../components/ui/file-progress";
import { useStore } from "../store/useStore";
import { useFileUpload } from "../hooks/useFileUpload";
import { downloadFile } from "../services/api";

export function HomePage() {
  const {
    files,
    uploadProgress,
    mergeResult,
    isUploading,
    isMerging,
    error,
    reset,
  } = useStore();
  const { handleUpload, canUpload } = useFileUpload();

  const handleDownload = useCallback(async () => {
    if (!mergeResult) return;

    try {
      const blob = await downloadFile(mergeResult.filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = mergeResult.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      reset();
    } catch (error) {
      console.error("Download error:", error);
    }
  }, [mergeResult, reset]);

  const getUploadStatus = () => {
    if (isUploading) return "uploading";
    if (isMerging) return "merging";
    return "idle";
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">MP3 Birleştirici</h1>
          <p className="text-sm text-gray-500">
            Birden fazla MP3 dosyasını tek bir dosyada birleştirin
          </p>
        </div>

        <FileUpload />
        <FileList />

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <FileProgress
          progress={uploadProgress}
          status={getUploadStatus()}
          className="max-w-md mx-auto"
        />

        <div className="flex justify-center gap-4">
          {!mergeResult && (
            <Button
              onClick={handleUpload}
              disabled={!canUpload || isUploading || isMerging}
            >
              {isUploading || isMerging ? "İşleniyor..." : "Birleştir"}
            </Button>
          )}

          {mergeResult && (
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              İndir ({mergeResult.filename})
            </Button>
          )}

          {files.length > 0 && (
            <Button variant="outline" onClick={reset}>
              Temizle
            </Button>
          )}
        </div>

        {mergeResult && (
          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium">Birleştirme Sonucu</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Dosya Adı</p>
                <p>{mergeResult.filename}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Boyut</p>
                <p>{mergeResult.size.toFixed(2)} MB</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Süre</p>
                <p>{Math.round(mergeResult.duration)} saniye</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Bit Hızı</p>
                <p>{mergeResult.bitRate} kbps</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
