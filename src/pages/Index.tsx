import { useState } from "react";
import { Leaf, PawPrint, Sparkles, ArrowRight, CheckCircle, Zap, Shield, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import { DiagnosticResult, DiagnosticData } from "@/components/DiagnosticResult";
import { AnalyzingState } from "@/components/AnalyzingState";
import { PhytoBot } from "@/components/PhytoBot";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.png";

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);
    setHealthyMessage(null);

    try {
      const imageBase64 = await fileToBase64(selectedImage);
      
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64 },
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
        setResult({
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
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setHealthyMessage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* PhytoBot Chatbot */}
      <PhytoBot />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Health Diagnostics
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 animate-slide-up">
              PhytoZoo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Upload an image of your plant or pet — get instant disease detection, 
              severity assessment, and treatment recommendations.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span>Plants & Crops</span>
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-accent" />
                <span>Pets & Livestock</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Cards Dashboard */}
      {!result && !isAnalyzing && !healthyMessage && !selectedImage && (
        <section className="container mx-auto px-4 -mt-6 mb-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Plant Detector</h3>
              <p className="text-xs text-muted-foreground mt-1">Leaves, fruits, stems</p>
            </div>
            
            <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Animal Detector</h3>
              <p className="text-xs text-muted-foreground mt-1">Skin, fur, eyes, wounds</p>
            </div>
            
            <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Prevention Tips</h3>
              <p className="text-xs text-muted-foreground mt-1">Organic & chemical</p>
            </div>
            
            <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground mt-1">Ask PhytoBot</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!result && !isAnalyzing && !healthyMessage && (
          <div className="space-y-8 animate-fade-in">
            <UploadZone
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
              onClear={handleClear}
            />

            {selectedImage && (
              <div className="text-center animate-slide-up">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={handleAnalyze}
                  className="group"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Image
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && <AnalyzingState />}

        {healthyMessage && !result && (
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-slide-up">
            <div className="glass-card rounded-2xl shadow-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
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
          <div className="space-y-8">
            <DiagnosticResult data={result} />
            <div className="text-center">
              <Button variant="outline" size="lg" onClick={handleNewAnalysis}>
                Analyze Another Image
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            ⚠️ This tool provides preliminary disease detection. Consult experts for confirmation.
          </p>
          <p className="text-xs text-muted-foreground">
            PhytoZoo uses AI for preliminary screening. Always consult professionals for accurate diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}
