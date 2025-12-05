import { Loader2, ScanSearch } from "lucide-react";

export function AnalyzingState() {
  return (
    <div className="w-full max-w-xl mx-auto text-center py-16 animate-fade-in">
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute w-24 h-24 rounded-full bg-primary/20 animate-ping" />
        <div className="relative p-6 rounded-full bg-primary/10">
          <ScanSearch className="w-12 h-12 text-primary animate-pulse-soft" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Analyzing your image...
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Our AI is examining the image for signs of disease, pest infestation, or abnormal conditions.
      </p>
      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        This may take a few seconds
      </div>
    </div>
  );
}
