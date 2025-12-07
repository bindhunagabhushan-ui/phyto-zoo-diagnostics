import { useState } from "react";
import { Trash2, Download, FileText, FileSpreadsheet, AlertTriangle, CheckCircle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useScanHistory, ScanRecord } from "@/hooks/useScanHistory";
import { exportScanToPDF, exportHistoryToCSV } from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const severityConfig = {
  low: {
    color: "bg-green-500",
    icon: CheckCircle,
    label: "Low",
  },
  medium: {
    color: "bg-yellow-500",
    icon: AlertTriangle,
    label: "Medium",
  },
  high: {
    color: "bg-red-500",
    icon: AlertTriangle,
    label: "High",
  },
};

export default function HistoryPage() {
  const { scans, deleteScan, clearHistory } = useScanHistory();
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);

  const handleExportPDF = (scan: ScanRecord) => {
    exportScanToPDF(scan);
    toast({
      title: "PDF Exported",
      description: "Your diagnostic report has been downloaded.",
    });
  };

  const handleExportCSV = () => {
    if (scans.length === 0) {
      toast({
        title: "No Data",
        description: "There are no scans to export.",
        variant: "destructive",
      });
      return;
    }
    exportHistoryToCSV(scans);
    toast({
      title: "CSV Exported",
      description: "Your scan history has been downloaded.",
    });
  };

  const handleDelete = (id: string) => {
    deleteScan(id);
    if (selectedScan?.id === id) {
      setSelectedScan(null);
    }
    toast({
      title: "Scan Deleted",
      description: "The scan has been removed from history.",
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setSelectedScan(null);
    toast({
      title: "History Cleared",
      description: "All scans have been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Scan History</h1>
          <p className="text-muted-foreground text-sm">{scans.length} scans recorded</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={scans.length === 0}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={scans.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {scans.length} scan records. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {scans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ScanLine className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No scan history</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your scan results will appear here
            </p>
            <Button asChild>
              <Link to="/scan">Start Your First Scan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan List */}
          <div className="lg:col-span-1 space-y-3">
            {scans.map((scan) => {
              const severity = severityConfig[scan.severity];
              const isSelected = selectedScan?.id === scan.id;
              
              return (
                <Card
                  key={scan.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedScan(scan)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={scan.imageDataUrl}
                        alt={scan.diseaseName}
                        className="w-14 h-14 rounded-lg object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{scan.diseaseName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {scan.species}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${severity.color}`} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Scan Details */}
          <div className="lg:col-span-2">
            {selectedScan ? (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedScan.imageDataUrl}
                      alt={selectedScan.diseaseName}
                      className="w-32 h-32 rounded-xl object-cover bg-muted"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-serif font-bold mb-1">
                        {selectedScan.diseaseName}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-3">
                        {selectedScan.species} • {selectedScan.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            severityConfig[selectedScan.severity].color
                          }`}
                        >
                          {severityConfig[selectedScan.severity].label} Severity
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {selectedScan.confidenceScore}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedScan.symptoms.map((symptom, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-muted rounded-lg text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-sm mb-2 text-primary">
                          Organic Prevention
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedScan.organicTreatment}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-2 text-accent">
                          Chemical Prevention
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedScan.chemicalTreatment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(selectedScan)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove this scan from your history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(selectedScan.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Select a scan to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
