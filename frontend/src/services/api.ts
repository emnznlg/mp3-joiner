import axios from "axios";
import { APIResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

export const uploadFiles = async (
  files: File[],
  silenceAfterIndices: number[] = [],
  outputFileName: string = "",
  onProgress?: (progress: number) => void
): Promise<APIResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("silenceAfter", JSON.stringify(silenceAfterIndices));

  if (outputFileName) {
    formData.append("outputFileName", outputFileName);
  }

  const { data } = await api.post<APIResponse>("/upload", formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentage);
      }
    },
  });

  return data;
};

export const downloadFile = async (filename: string): Promise<Blob> => {
  const response = await api.get(`/download/${filename}`, {
    responseType: "blob",
  });
  return response.data;
};
