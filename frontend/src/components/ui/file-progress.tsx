import { Progress } from "./progress";

interface FileProgressProps {
  progress: number;
  status: "uploading" | "merging" | "idle";
  className?: string;
}

export function FileProgress({
  progress,
  status,
  className,
}: FileProgressProps) {
  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Dosyalar yükleniyor...";
      case "merging":
        return "Dosyalar birleştiriliyor...";
      default:
        return "";
    }
  };

  if (status === "idle") return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{getStatusText()}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
