import { useCallback, useState, useRef } from "react";
import { Upload, FolderOpen, Camera, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CameraModal } from "./CameraModal";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export function UploadZone({ onImageSelect, selectedImage, onClear }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (file: File) => {
    onImageSelect(file);
    setPreview(URL.createObjectURL(file));
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
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={openFileBrowser}
        className={cn(
          "relative w-full p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div
            className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              isDragOver
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-secondary text-primary group-hover:bg-primary/10"
            )}
          >
            {isDragOver ? (
              <Image className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg text-foreground">
              {isDragOver ? "Drop your image here" : "Drag & drop image"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
        </div>
      </div>

      {/* Upload Method Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={openFileBrowser}
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5 hover:border-primary/50"
        >
          <Upload className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Upload</span>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={openFileBrowser}
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5 hover:border-primary/50"
        >
          <FolderOpen className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Browse</span>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={openCamera}
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-accent/10 hover:border-accent/50"
        >
          <Camera className="w-5 h-5 text-accent" />
          <span className="text-xs font-medium">Camera</span>
        </Button>
      </div>

      {/* Supported types */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Plants:</span> leaves, fruits, stems, vegetables
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Animals:</span> skin, fur, eyes, wounds, teeth, nails
        </p>
      </div>
    </div>
  );
}
