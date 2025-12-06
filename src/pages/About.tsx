import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PhytoBot } from "@/components/PhytoBot";
import { Brain, Leaf, PawPrint, Sparkles, Shield, Mic, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <PhytoBot />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                About PhytoZoo
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                AI-Powered Health Diagnostics
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                PhytoZoo uses advanced vision AI models to analyze images of plants and animals, 
                providing instant disease detection and treatment recommendations.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">LLM Vision AI</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by advanced multimodal AI models trained on vast datasets of plant and animal health conditions.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Plant Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze leaves, fruits, vegetables, and stems for diseases like blight, rust, mildew, and nutrient deficiencies.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4">
                  <PawPrint className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Animal Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Examine skin, fur, eyes, teeth, nails, and wounds for infections, allergies, injuries, and other conditions.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Voice Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  PhytoBot supports speech-to-text and text-to-speech for hands-free interaction on any device.
                </p>
              </div>
            </div>

            {/* What We Provide */}
            <div className="glass-card rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-serif font-semibold text-xl text-foreground">What We Provide</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Disease name identification",
                  "Visual symptom analysis",
                  "Severity level assessment",
                  "Organic treatment options",
                  "Chemical treatment options",
                  "Best outcome predictions",
                  "Confidence scoring",
                  "Voice-enabled assistance",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="glass-card rounded-2xl p-6 bg-amber-500/5 border-amber-500/20">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-2">
                ⚠️ Important Disclaimer
              </p>
              <p className="text-sm text-muted-foreground">
                PhytoZoo provides AI-based preliminary screening only. For accurate diagnosis and treatment, 
                always consult with qualified agricultural experts for plants and licensed veterinarians for animals.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
