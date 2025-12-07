import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import { DiagnosticResult, DiagnosticData } from "@/components/DiagnosticResult";
import { AnalyzingState } from "@/components/AnalyzingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useScanHistory } from "@/hooks/useScanHistory";

export default function NewScan() {
  const navigate = useNavigate();
  const { addScan } = useScanHistory();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticData | null>(null);
  const [healthyMessage, setHealthyMessage] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    const dataUrl = await fileToBase64(file);
    setImageDataUrl(dataUrl);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !imageDataUrl) return;

    setIsAnalyzing(true);
    setResult(null);
    setHealthyMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: imageDataUrl },
      });

      if (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze image. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data.error) {
        toast({
          title: "Analysis Error",
          description: data.error,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data.detected === false) {
        setHealthyMessage(data.message || "No disease or abnormal condition detected.");
        toast({
          title: "Good News!",
          description: "No health issues detected in your image.",
        });
      } else {
        const diagnosticData: DiagnosticData = {
          detectedCategory: data.detectedCategory || (data.category === "plant" ? "Plant" : "Animal"),
          detectedSpecies: data.detectedSpecies || "Unknown",
          detectedPart: data.detectedPart || "Unknown",
          conditionName: data.conditionName,
          category: data.category,
          symptoms: data.symptoms || [],
          severity: data.severity || "low",
          organicTreatment: data.organicTreatment || "",
          chemicalTreatment: data.chemicalTreatment || "",
          monitoring: data.monitoring || [],
          confidenceScore: data.confidenceScore || 0,
        };
        
        setResult(diagnosticData);

        // Save to history
        addScan({
          imageDataUrl: imageDataUrl,
          category: diagnosticData.detectedCategory,
          species: diagnosticData.detectedSpecies,
          diseaseName: diagnosticData.conditionName,
          symptoms: diagnosticData.symptoms,
          severity: diagnosticData.severity,
          organicTreatment: diagnosticData.organicTreatment,
          chemicalTreatment: diagnosticData.chemicalTreatment,
          monitoring: diagnosticData.monitoring,
          confidenceScore: diagnosticData.confidenceScore,
        });

        toast({
          title: "Scan Saved",
          description: "Your scan has been saved to history.",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImageDataUrl(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setImageDataUrl(null);
    setResult(null);
    setHealthyMessage(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">New Scan</h1>
        <p className="text-muted-foreground text-sm">
          Upload or capture an image to detect diseases
        </p>
      </div>

      {!result && !isAnalyzing && !healthyMessage && (
        <div className="space-y-6">
          <UploadZone
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
          />

          {selectedImage && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                className="gap-2"
              >
                <Zap className="w-5 h-5" />
                Analyze Image
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {isAnalyzing && <AnalyzingState />}

      {healthyMessage && !result && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm p-8 text-center border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
              Looking Healthy!
            </h2>
            <p className="text-muted-foreground">{healthyMessage}</p>
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={handleNewAnalysis}>
              Analyze Another Image
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <DiagnosticResult data={result} />
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={handleNewAnalysis}>
              Analyze Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
