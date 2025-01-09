import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useStore } from "../../store/useStore";

export function FileUpload() {
  const { addFiles, files, fileInputKey } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Sadece MP3 dosyalarını kabul et
      const mp3Files = acceptedFiles.filter(
        (file) => file.type === "audio/mpeg" || file.name.endsWith(".mp3")
      );

      if (mp3Files.length > 0) {
        addFiles(mp3Files);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
    },
    maxFiles: 50,
    noClick: true, // Sadece sürükle-bırak ve buton ile dosya seçimine izin ver
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary/50",
        files.length > 0 && "border-primary/50 bg-primary/5"
      )}
    >
      <input {...getInputProps()} ref={fileInputRef} key={fileInputKey} />
      <div className="flex flex-col items-center gap-4">
        <UploadCloud
          className={cn(
            "w-12 h-12",
            isDragActive ? "text-primary" : "text-gray-400"
          )}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? (
              "Dosyaları buraya bırakın"
            ) : (
              <>
                <span className="text-primary">Dosyaları seçin</span> veya
                buraya sürükleyin
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">
            Sadece MP3 dosyaları • Maksimum 50 dosya
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleButtonClick}>
          Dosya Seç
        </Button>
      </div>
    </div>
  );
}
