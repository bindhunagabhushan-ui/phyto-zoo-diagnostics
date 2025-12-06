import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PhytoBot } from "@/components/PhytoBot";
import { PawPrint, Eye, Scissors, Heart, Bandage, AlertCircle } from "lucide-react";

export default function Animals() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <PhytoBot />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-accent text-sm font-medium mb-4">
                <PawPrint className="w-4 h-4" />
                Animal Health Detection
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Zoo Detection Panel
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload images of skin, fur, teeth, eyes, nails, or wounds to detect health issues and get care recommendations.
              </p>
            </div>

            {/* Animal Parts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Skin</h3>
                <p className="text-xs text-muted-foreground mt-1">Skin conditions & infections</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                  <PawPrint className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Fur</h3>
                <p className="text-xs text-muted-foreground mt-1">Fur & coat health</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Eyes</h3>
                <p className="text-xs text-muted-foreground mt-1">Eye infections & issues</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-500/5 flex items-center justify-center">
                  <Scissors className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Teeth</h3>
                <p className="text-xs text-muted-foreground mt-1">Dental health check</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center">
                  <PawPrint className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Nails</h3>
                <p className="text-xs text-muted-foreground mt-1">Nail & paw conditions</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                  <Bandage className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Wounds</h3>
                <p className="text-xs text-muted-foreground mt-1">Injury assessment</p>
              </div>
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">When to see a veterinarian</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI provides preliminary assessment only. For serious conditions, bleeding, or behavioral changes, 
                  always consult a licensed veterinarian immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
