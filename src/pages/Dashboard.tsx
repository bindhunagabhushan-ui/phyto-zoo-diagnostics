import { Link } from "react-router-dom";
import { ScanLine, History, Clock, AlertTriangle, CheckCircle, Leaf, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/useScanHistory";

const severityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function Dashboard() {
  const { scans } = useScanHistory();
  const recentScans = scans.slice(0, 5);

  const stats = {
    total: scans.length,
    plants: scans.filter((s) => s.category.toLowerCase().includes("plant")).length,
    animals: scans.filter((s) => s.category.toLowerCase().includes("animal")).length,
    highSeverity: scans.filter((s) => s.severity === "high").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome to PhytoZoo</p>
        </div>
        <Button asChild size="lg">
          <Link to="/scan" className="flex items-center gap-2">
            <ScanLine className="w-5 h-5" />
            Start Scan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plants}</p>
                <p className="text-sm text-muted-foreground">Plants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <PawPrint className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.animals}</p>
                <p className="text-sm text-muted-foreground">Animals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highSeverity}</p>
                <p className="text-sm text-muted-foreground">High Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Scans</CardTitle>
          {scans.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">View All</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No scans yet</p>
              <Button asChild>
                <Link to="/scan">Start Your First Scan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <img
                    src={scan.imageDataUrl}
                    alt={scan.diseaseName}
                    className="w-12 h-12 rounded-lg object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{scan.diseaseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {scan.species} • {scan.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${severityColors[scan.severity]}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/scan">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/10">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Scan Plant</h3>
                  <p className="text-sm text-muted-foreground">
                    Detect diseases in leaves, fruits, stems
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/scan">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-accent/10">
                  <PawPrint className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Scan Animal</h3>
                  <p className="text-sm text-muted-foreground">
                    Detect issues in skin, fur, eyes, wounds
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
