export interface MP3File {
  originalName: string;
  size: number; // MB cinsinden
  duration: number; // saniye cinsinden
  bitRate: number; // kbps cinsinden
  silenceAfter?: boolean; // Dosyadan sonra sessizlik eklenecek mi?
}

export interface MergeResult {
  filename: string;
  size: number;
  duration: number;
  bitRate: number;
  downloadUrl: string;
}

export interface APIResponse {
  status: "success" | "error";
  message: string;
  files?: MP3File[];
  result?: MergeResult;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
