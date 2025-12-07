import jsPDF from "jspdf";
import { ScanRecord } from "@/hooks/useScanHistory";

export function exportScanToPDF(scan: ScanRecord) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PhytoZoo Diagnostic Report", margin, y);
  y += lineHeight * 2;

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date(scan.createdAt).toLocaleString()}`, margin, y);
  y += lineHeight * 2;

  // Detection Summary
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detection Summary", margin, y);
  y += lineHeight;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Category: ${scan.category}`, margin, y);
  y += lineHeight;
  doc.text(`Species: ${scan.species}`, margin, y);
  y += lineHeight;
  doc.text(`Disease: ${scan.diseaseName}`, margin, y);
  y += lineHeight;
  doc.text(`Severity: ${scan.severity.toUpperCase()}`, margin, y);
  y += lineHeight;
  doc.text(`Confidence: ${scan.confidenceScore}%`, margin, y);
  y += lineHeight * 2;

  // Symptoms
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Symptoms", margin, y);
  y += lineHeight;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  scan.symptoms.forEach((symptom, i) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.text(`${i + 1}. ${symptom}`, margin, y);
    y += lineHeight;
  });
  y += lineHeight;

  // Organic Treatment
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Organic Prevention", margin, y);
  y += lineHeight;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const organicLines = doc.splitTextToSize(scan.organicTreatment, pageWidth - margin * 2);
  organicLines.forEach((line: string) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  y += lineHeight;

  // Chemical Treatment
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Chemical Prevention", margin, y);
  y += lineHeight;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const chemicalLines = doc.splitTextToSize(scan.chemicalTreatment, pageWidth - margin * 2);
  chemicalLines.forEach((line: string) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  y += lineHeight;

  // Monitoring Steps
  if (scan.monitoring && scan.monitoring.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Monitoring Steps", margin, y);
    y += lineHeight;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    scan.monitoring.forEach((step, i) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.text(`${i + 1}. ${step}`, margin, y);
      y += lineHeight;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(
    "This report is for preliminary screening only. Consult qualified professionals.",
    margin,
    285
  );

  doc.save(`phytozoo-report-${scan.id}.pdf`);
}

export function exportHistoryToCSV(scans: ScanRecord[]) {
  const headers = [
    "ID",
    "Date",
    "Category",
    "Species",
    "Disease",
    "Severity",
    "Confidence",
    "Symptoms",
    "Organic Treatment",
    "Chemical Treatment",
  ];

  const rows = scans.map((scan) => [
    scan.id,
    new Date(scan.createdAt).toLocaleString(),
    scan.category,
    scan.species,
    scan.diseaseName,
    scan.severity,
    scan.confidenceScore.toString(),
    scan.symptoms.join("; "),
    scan.organicTreatment.replace(/"/g, '""'),
    scan.chemicalTreatment.replace(/"/g, '""'),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `phytozoo-history-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
