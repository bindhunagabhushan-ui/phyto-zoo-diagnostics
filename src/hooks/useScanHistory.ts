import { useState, useEffect } from "react";

export interface ScanRecord {
  id: string;
  imageDataUrl: string;
  category: string;
  species: string;
  diseaseName: string;
  symptoms: string[];
  severity: "low" | "medium" | "high";
  organicTreatment: string;
  chemicalTreatment: string;
  monitoring: string[];
  confidenceScore: number;
  createdAt: string;
}

const STORAGE_KEY = "phytozoo-scan-history";

export function useScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setScans(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scan history:", e);
      }
    }
  }, []);

  const saveScans = (newScans: ScanRecord[]) => {
    setScans(newScans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScans));
  };

  const addScan = (scan: Omit<ScanRecord, "id" | "createdAt">) => {
    const newScan: ScanRecord = {
      ...scan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newScans = [newScan, ...scans];
    saveScans(newScans);
    return newScan;
  };

  const deleteScan = (id: string) => {
    const newScans = scans.filter((s) => s.id !== id);
    saveScans(newScans);
  };

  const clearHistory = () => {
    saveScans([]);
  };

  return { scans, addScan, deleteScan, clearHistory };
}
