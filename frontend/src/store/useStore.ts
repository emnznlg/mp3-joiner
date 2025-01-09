import { create } from "zustand";
import { MergeResult } from "../types";

interface Store {
  files: File[];
  silenceAfterIndices: number[];
  outputFileName: string;
  uploadProgress: number;
  mergeResult: MergeResult | null;
  isUploading: boolean;
  isMerging: boolean;
  error: string | null;
  fileInputKey: number;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  reorderFiles: (newFiles: File[]) => void;
  toggleSilence: (index: number) => void;
  setOutputFileName: (name: string) => void;
  setUploadProgress: (progress: number) => void;
  setMergeResult: (result: MergeResult) => void;
  setIsUploading: (status: boolean) => void;
  setIsMerging: (status: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useStore = create<Store>((set) => ({
  files: [],
  silenceAfterIndices: [],
  outputFileName: "",
  uploadProgress: 0,
  mergeResult: null,
  isUploading: false,
  isMerging: false,
  error: null,
  fileInputKey: 0,

  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
      error: null,
    })),

  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
      silenceAfterIndices: state.silenceAfterIndices
        .filter((i) => i !== index)
        .map((i) => (i > index ? i - 1 : i)),
      fileInputKey: state.fileInputKey + 1,
    })),

  reorderFiles: (newFiles) =>
    set((state) => {
      // Dosya sıralaması değiştiğinde sessizlik indekslerini güncelle
      const oldOrder = state.files.map((file) => file.name);
      const newOrder = newFiles.map((file) => file.name);

      const newSilenceIndices = state.silenceAfterIndices.map((oldIndex) => {
        const fileName = oldOrder[oldIndex];
        return newOrder.indexOf(fileName);
      });

      return {
        files: newFiles,
        silenceAfterIndices: newSilenceIndices,
      };
    }),

  toggleSilence: (index) =>
    set((state) => ({
      silenceAfterIndices: state.silenceAfterIndices.includes(index)
        ? state.silenceAfterIndices.filter((i) => i !== index)
        : [...state.silenceAfterIndices, index].sort((a, b) => a - b),
    })),

  setOutputFileName: (name) =>
    set(() => ({
      outputFileName: name,
    })),

  setUploadProgress: (progress) =>
    set(() => ({
      uploadProgress: progress,
    })),

  setMergeResult: (result) =>
    set(() => ({
      mergeResult: result,
      isUploading: false,
      isMerging: false,
    })),

  setIsUploading: (status) =>
    set(() => ({
      isUploading: status,
      error: null,
    })),

  setIsMerging: (status) =>
    set(() => ({
      isMerging: status,
      error: null,
    })),

  setError: (error) =>
    set(() => ({
      error,
      isUploading: false,
      isMerging: false,
    })),

  reset: () =>
    set((state) => ({
      files: [],
      silenceAfterIndices: [],
      outputFileName: "",
      uploadProgress: 0,
      mergeResult: null,
      isUploading: false,
      isMerging: false,
      error: null,
      fileInputKey: state.fileInputKey + 1,
    })),
}));
