import { useCallback } from "react";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { uploadFiles } from "../services/api";

export function useFileUpload() {
  const {
    files,
    silenceAfterIndices,
    outputFileName,
    setUploadProgress,
    setIsUploading,
    setIsMerging,
    setMergeResult,
    setError,
  } = useStore();

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      setError("Lütfen en az bir MP3 dosyası seçin");
      return;
    }

    if (files.length > 50) {
      setError("En fazla 50 dosya yükleyebilirsiniz");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const toastId = toast.loading("MP3 dosyaları yükleniyor...", {
        duration: Infinity,
      });

      const response = await uploadFiles(
        files,
        silenceAfterIndices,
        outputFileName,
        (progress) => {
          setUploadProgress(progress);
          if (progress < 100) {
            toast.loading(`Dosyalar yükleniyor... %${progress}`, {
              id: toastId,
            });
          } else {
            toast.loading("Dosyalar birleştiriliyor...", {
              id: toastId,
            });
          }
        }
      );

      if (response.status === "success" && response.result) {
        setMergeResult(response.result);
        toast.success("MP3 dosyaları başarıyla birleştirildi!", {
          id: toastId,
        });
      } else {
        throw new Error(response.message || "Bir hata oluştu");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Bir hata oluştu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setIsMerging(false);
      setUploadProgress(0);
    }
  }, [
    files,
    silenceAfterIndices,
    outputFileName,
    setUploadProgress,
    setIsUploading,
    setIsMerging,
    setMergeResult,
    setError,
  ]);

  return {
    handleUpload,
    canUpload: files.length > 0 && files.length <= 50,
  };
}
