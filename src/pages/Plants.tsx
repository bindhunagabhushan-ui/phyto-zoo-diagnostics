import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PhytoBot } from "@/components/PhytoBot";
import { Leaf, Sprout, Apple, TreeDeciduous, AlertCircle } from "lucide-react";

export default function Plants() {
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
                <Leaf className="w-4 h-4" />
                Plant Health Detection
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Phyto Detection Panel
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload images of leaves, fruits, vegetables, or stems to detect diseases and get treatment recommendations.
              </p>
            </div>

            {/* Plant Parts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Leaves</h3>
                <p className="text-xs text-muted-foreground mt-1">Detect leaf diseases</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                  <Apple className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Fruits</h3>
                <p className="text-xs text-muted-foreground mt-1">Fruit health analysis</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                  <Sprout className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Vegetables</h3>
                <p className="text-xs text-muted-foreground mt-1">Vegetable inspection</p>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                  <TreeDeciduous className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Stems</h3>
                <p className="text-xs text-muted-foreground mt-1">Stem condition check</p>
              </div>
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">How it works</h3>
                <p className="text-sm text-muted-foreground">
                  Go to the Home page to upload or capture an image of your plant. Our AI will analyze it 
                  and provide detailed disease detection, symptoms, and both organic and chemical treatment options.
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
