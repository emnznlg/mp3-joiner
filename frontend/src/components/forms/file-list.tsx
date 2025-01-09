import { useCallback } from "react";
import { Music, Trash2, GripVertical, Volume2, VolumeX } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useStore } from "../../store/useStore";
import { FileNameInput } from "./file-name-input";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

interface SortableFileItemProps {
  id: string;
  file: File;
  index: number;
  hasSilence: boolean;
  onRemove: (index: number) => (e: React.MouseEvent) => void;
  onToggleSilence: (index: number) => (e: React.MouseEvent) => void;
}

function SortableFileItem({
  id,
  file,
  index,
  hasSilence,
  onRemove,
  onToggleSilence,
}: SortableFileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-secondary/50",
        "hover:bg-secondary/70 transition-colors",
        isDragging && "opacity-50"
      )}
      {...attributes}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing"
        aria-label="Sırala"
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </button>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Music className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-400",
            hasSilence && "text-primary hover:text-primary/80",
            !hasSilence && "hover:text-primary"
          )}
          onClick={onToggleSilence(index)}
          title={hasSilence ? "Sessizliği kaldır" : "Sessizlik ekle"}
        >
          {hasSilence ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="sr-only">
            {hasSilence ? "Sessizliği kaldır" : "Sessizlik ekle"}
          </span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-destructive"
          onClick={onRemove(index)}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Sil</span>
        </Button>
      </div>
    </li>
  );
}

export function FileList() {
  const {
    files,
    removeFile,
    reorderFiles,
    silenceAfterIndices,
    toggleSilence,
  } = useStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRemove = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      removeFile(index);
    },
    [removeFile]
  );

  const handleToggleSilence = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleSilence(index);
    },
    [toggleSilence]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = files.findIndex(
          (file) => `${file.name}-${file.size}` === active.id
        );
        const newIndex = files.findIndex(
          (file) => `${file.name}-${file.size}` === over.id
        );
        const newFiles = arrayMove(files, oldIndex, newIndex);
        reorderFiles(newFiles);
      }
    },
    [files, reorderFiles]
  );

  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Yüklenecek Dosyalar</h3>
        <span className="text-xs text-gray-500">
          {files.length} dosya seçildi
        </span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((file) => `${file.name}-${file.size}`)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {files.map((file, index) => (
              <SortableFileItem
                key={`${file.name}-${file.size}`}
                id={`${file.name}-${file.size}`}
                file={file}
                index={index}
                hasSilence={silenceAfterIndices.includes(index)}
                onRemove={handleRemove}
                onToggleSilence={handleToggleSilence}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <FileNameInput />
    </div>
  );
}
