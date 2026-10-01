import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Shell, PageHeader } from "@/components/Shell";
import { ScanResult, statusColor } from "@/components/ScanResult";
import api, { apiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Trash2, Download, Eye, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["All", "Healthy", "Leaf Spot", "Blight", "Root Rot", "Deficiency", "Pest Infestation", "Viral", "Unknown"];

export default function HistoryPage() {
  const [params] = useSearchParams();
  const [scans, setScans] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = () =>
    api.get("/scans").then((r) => setScans(r.data.scans)).catch(() => setScans([]));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = params.get("scan");
    if (id) openScan(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const openScan = async (id) => {
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/scans/${id}`);
      setSelected(data.scan);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoadingDetail(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/scans/${id}`);
      toast.success("Scan deleted.");
      setScans((s) => s.filter((x) => x.id !== id));
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const exportData = async () => {
    try {
      const { data } = await api.get("/users/me/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "floraai-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported.");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const filtered = useMemo(() => {
    if (!scans) return [];
    return scans.filter((s) => {
      const okStatus = status === "All" || s.status === status;
      const okQuery = !query || (s.plant_name || "").toLowerCase().includes(query.toLowerCase());
      return okStatus && okQuery;
    });
  }, [scans, status, query]);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Your archive"
          title="Scan history"
          description="Every diagnostic report saved to your account."
          action={
            <Button variant="outline" onClick={exportData} className="rounded-full" data-testid="export-data-button">
              <Download className="mr-2 h-4 w-4" /> Export my data
            </Button>
          }
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by plant name…"
              className="pl-9"
              data-testid="history-search-input"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-56" data-testid="history-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          {scans === null ? (
            <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed border-primary/20 bg-transparent" data-testid="history-empty">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  {scans.length === 0 ? "No scans yet — run your first analysis on the dashboard." : "No scans match your filters."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="history-grid">
              {filtered.map((s) => (
                <Card key={s.id} className="group overflow-hidden border-primary/10" data-testid={`history-card-${s.id}`}>
                  <div className="relative h-40 overflow-hidden bg-secondary">
                    {s.image_base64 ? (
                      <img src={s.image_base64} alt={s.plant_name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : null}
                    <Badge className={`absolute left-3 top-3 rounded-full border ${statusColor(s.status)}`}>{s.status}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-base font-semibold text-foreground">{s.plant_name || "Plant"}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {new Date(s.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono text-lg font-bold" style={{ color: s.health_score >= 75 ? "hsl(103 51% 25%)" : s.health_score >= 45 ? "hsl(38 78% 45%)" : "hsl(14 63% 44%)" }}>
                        {s.health_score}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => openScan(s.id)} data-testid={`view-scan-${s.id}`}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(s.id)} data-testid={`delete-scan-${s.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selected || loadingDetail} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl" data-testid="scan-detail-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif">Diagnostic report</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            selected && <ScanResult scan={selected} />
          )}
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
