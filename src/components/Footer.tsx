import { Leaf, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-lg text-foreground">PhytoZoo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered health diagnostics for plants and animals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Plant Disease Detection</li>
              <li>Animal Health Analysis</li>
              <li>Organic Treatment Tips</li>
              <li>AI Chat Assistant</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@phytozoo.app</li>
              <li>Help Center</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 PhytoZoo. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for healthier plants & animals
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ AI-based preliminary screening only. Consult professionals for diagnosis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
