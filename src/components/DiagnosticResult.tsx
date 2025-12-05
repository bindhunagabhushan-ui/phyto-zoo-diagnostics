import { AlertTriangle, CheckCircle, Leaf, Shield, Activity, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiagnosticData {
  conditionName: string;
  category: "plant" | "animal";
  symptoms: string[];
  severity: "low" | "medium" | "high";
  organicTreatment: string;
  chemicalTreatment: string;
  monitoring: string[];
  confidenceScore: number;
}

interface DiagnosticResultProps {
  data: DiagnosticData;
}

const severityConfig = {
  low: {
    color: "bg-severity-low",
    textColor: "text-severity-low",
    label: "Low Severity",
    icon: CheckCircle,
  },
  medium: {
    color: "bg-severity-medium",
    textColor: "text-severity-medium",
    label: "Medium Severity",
    icon: AlertTriangle,
  },
  high: {
    color: "bg-severity-high",
    textColor: "text-severity-high",
    label: "High Severity",
    icon: AlertTriangle,
  },
};

export function DiagnosticResult({ data }: DiagnosticResultProps) {
  const severity = severityConfig[data.severity];
  const SeverityIcon = severity.icon;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header Card */}
      <div className="bg-card rounded-2xl shadow-card p-6 gradient-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              {data.category === "plant" ? "Plant Condition" : "Animal Condition"}
            </p>
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              {data.conditionName}
            </h2>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              severity.color,
              "text-white"
            )}
          >
            <SeverityIcon className="w-4 h-4" />
            {severity.label}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold text-foreground">{data.confidenceScore}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${data.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Visual Symptoms Detected</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.symptoms.map((symptom, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Treatment Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Organic Treatment */}
        <div className="bg-card rounded-2xl shadow-card p-6 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Organic / Natural Option</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {data.organicTreatment}
          </p>
        </div>

        {/* Chemical Treatment */}
        <div className="bg-card rounded-2xl shadow-card p-6 border-l-4 border-accent">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Chemical / Conventional Option</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {data.chemicalTreatment}
          </p>
        </div>
      </div>

      {/* Monitoring */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">How to Monitor Progress</h3>
        </div>
        <ul className="space-y-2">
          {data.monitoring.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-muted-foreground text-sm">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-2xl p-5 border border-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> For best results and accurate diagnosis, 
            consult a trained {data.category === "plant" ? "botanist or agronomist" : "veterinarian"} — 
            this tool is for preliminary screening only.
          </p>
        </div>
      </div>
    </div>
  );
}
