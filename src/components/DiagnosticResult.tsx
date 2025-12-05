import { AlertTriangle, CheckCircle, Leaf, Shield, Activity, TrendingUp, Info, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Important:</strong> This tool provides preliminary disease detection. 
          Consult {data.category === "plant" ? "agricultural experts or botanists" : "veterinary professionals"} for confirmation and treatment.
        </p>
      </div>

      {/* Card 1: Disease Identified */}
      <Card className="shadow-card gradient-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {data.category === "plant" ? "Plant Condition" : "Animal Condition"}
                </p>
                <CardTitle className="text-xl md:text-2xl font-serif mt-1">
                  {data.conditionName}
                </CardTitle>
              </div>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold text-foreground">{data.confidenceScore}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
              style={{ width: `${data.confidenceScore}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Symptoms Detected */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <CardTitle className="text-lg">Symptoms Detected</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards 3 & 4: Treatment Options - Side by Side */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Card 3: Organic Preventive Measures */}
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-base">Organic Preventive Measures</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.organicTreatment}
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Chemical Preventive Measures */}
        <Card className="shadow-card border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="text-base">Chemical Preventive Measures</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.chemicalTreatment}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card 5: Best Outcome / Monitoring */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">Best Corrective Outcome</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Follow these steps to monitor progress and achieve the best recovery outcome:
          </p>
          <ul className="space-y-3">
            {data.monitoring.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-foreground/90 text-sm pt-1">{step}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Professional Consultation Reminder */}
      <div className="bg-muted/50 rounded-xl p-5 border border-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Professional Advice:</strong> For best results and accurate diagnosis, 
            consult a trained {data.category === "plant" ? "botanist, agronomist, or plant pathologist" : "veterinarian or animal health specialist"} — 
            this tool is for preliminary screening only. Early professional intervention leads to better outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
