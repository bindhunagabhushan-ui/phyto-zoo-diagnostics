import { useState } from "react";
import { Leaf, PawPrint, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import { DiagnosticResult, DiagnosticData } from "@/components/DiagnosticResult";
import { AnalyzingState } from "@/components/AnalyzingState";
import heroBg from "@/assets/hero-bg.png";

// Mock diagnostic results for demo
const mockPlantResult: DiagnosticData = {
  conditionName: "Tomato — Late Blight (Phytophthora infestans)",
  category: "plant",
  symptoms: [
    "Dark brown leaf spots",
    "White fuzzy growth on underside",
    "Stem lesions",
    "Fruit rot beginning",
  ],
  severity: "medium",
  organicTreatment:
    "Apply copper-based fungicide (Bordeaux mixture). Remove and destroy affected leaves. Improve air circulation by pruning. Use mulch to prevent soil splash. Consider companion planting with basil.",
  chemicalTreatment:
    "Apply chlorothalonil or mancozeb fungicide every 7-10 days. For severe cases, systemic fungicides like metalaxyl may be recommended. Always follow label instructions and observe pre-harvest intervals.",
  monitoring: [
    "Take weekly photos to track progression",
    "Check surrounding plants for spread",
    "Monitor humidity levels (keep below 90%)",
    "Inspect new growth for symptoms",
    "If no improvement in 2 weeks, seek professional help",
  ],
  confidenceScore: 87,
};

const mockAnimalResult: DiagnosticData = {
  conditionName: "Dog — Fungal Dermatosis (Ringworm)",
  category: "animal",
  symptoms: [
    "Circular hair loss patches",
    "Scaly skin lesions",
    "Mild redness",
    "Crusty edges on affected areas",
  ],
  severity: "low",
  organicTreatment:
    "Clean affected area with diluted apple cider vinegar. Apply coconut oil with tea tree oil (diluted). Keep area clean and dry. Wash bedding in hot water. Boost immune system with proper nutrition.",
  chemicalTreatment:
    "Topical antifungal cream (miconazole or clotrimazole) applied twice daily. For widespread cases, oral antifungal medication (griseofulvin or itraconazole) may be prescribed by a veterinarian.",
  monitoring: [
    "Take photos every 3-4 days to track healing",
    "Isolate pet from other animals",
    "Disinfect grooming tools and living areas",
    "Watch for spread to other body areas",
    "Consult a vet if lesions increase or pet shows discomfort",
  ],
  confidenceScore: 92,
};

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticData | null>(null);

  const handleAnalyze = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      // Randomly pick between plant or animal result for demo
      const mockResult = Math.random() > 0.5 ? mockPlantResult : mockAnimalResult;
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {!result && !isAnalyzing && (
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
                  Analyze Image
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && <AnalyzingState />}

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
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            PhytoZoo uses AI for preliminary screening. Always consult professionals for accurate diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}
