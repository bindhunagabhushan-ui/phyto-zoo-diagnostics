import { useCallback, useState } from "react";
import { Upload, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export function UploadZone({ onImageSelect, selectedImage, onClear }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onImageSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    onClear();
    setPreview(null);
  };

  if (selectedImage && preview) {
    return (
      <div className="relative w-full max-w-xl mx-auto animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-card">
          <img
            src={preview}
            alt="Selected"
            className="w-full h-80 object-contain bg-muted/50"
          />
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-soft hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-3 text-sm text-muted-foreground">
          {selectedImage.name}
        </p>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={cn(
        "relative w-full max-w-xl mx-auto p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
        isDragOver
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div
          className={cn(
            "p-5 rounded-2xl transition-all duration-300",
            isDragOver
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-secondary text-primary group-hover:bg-primary/10"
          )}
        >
          {isDragOver ? (
            <Image className="w-10 h-10" />
          ) : (
            <Upload className="w-10 h-10" />
          )}
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg text-foreground">
            {isDragOver ? "Drop your image here" : "Upload an image"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Plants: leaves, fruits, stems, vegetables
            <br />
            Animals: skin, fur, eyes, wounds
          </p>
        </div>
      </div>
    </div>
  );
}
