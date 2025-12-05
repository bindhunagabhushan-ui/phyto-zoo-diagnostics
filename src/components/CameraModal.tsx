import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Stop existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please ensure camera permissions are granted.");
      setIsLoading(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
          onClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in">
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Modal content */}
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video container */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
                <p className="text-white/70 text-sm">Initializing camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-white/90 font-medium mb-2">Camera Error</p>
                <p className="text-white/60 text-sm max-w-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full h-full object-cover",
              (isLoading || error) && "opacity-0"
            )}
          />

          {/* Viewfinder overlay */}
          {!isLoading && !error && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-white/30 rounded-lg" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Switch camera button */}
          <button
            onClick={toggleFacingMode}
            disabled={isLoading || !!error}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-6 h-6 text-white" />
          </button>

          {/* Capture button */}
          <button
            onClick={handleCapture}
            disabled={isLoading || !!error}
            className="p-6 rounded-full bg-white hover:bg-white/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            <Camera className="w-8 h-8 text-black" />
          </button>

          {/* Placeholder for symmetry */}
          <div className="w-14" />
        </div>

        <p className="text-center text-white/60 text-sm mt-4">
          Position the plant or animal clearly in frame, then tap capture
        </p>
      </div>
    </div>
  );
}
