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
import { Search, Trash2, Download, Eye, Loader2, Inbox, Sprout, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["All", "Healthy", "Leaf Spot", "Blight", "Root Rot", "Deficiency", "Pest Infestation", "Viral", "Wilt", "Unknown"];

export default function HistoryPage() {
  const [params] = useSearchParams();
  const [scans, setScans] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadError, setLoadError] = useState("");

  const load = () =>
    api.get("/scans").then((r) => { setScans(r.data.scans); setLoadError(""); }).catch((e) => { setScans([]); setLoadError(apiError(e)); });

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
      toast.success("Plant scan deleted.");
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
      a.download = "floraai-plant-scans.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Plant scan history exported.");
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

  const healthyCount = (scans || []).filter((scan) => scan.status === "Healthy").length;
  const attentionCount = (scans || []).filter((scan) => scan.status !== "Healthy").length;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="My Plant History"
          title="Your scan history"
          description="Every saved plant check, with its photo, health result, and care report in one place."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="rounded-full border-primary/20 text-xs font-semibold uppercase tracking-wider"
              data-testid="export-data-button"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export History (JSON)
            </Button>
          }
        />

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Saved scans", value: scans?.length ?? "—" },
            { label: "Healthy", value: scans ? healthyCount : "—" },
            { label: "Needs attention", value: scans ? attentionCount : "—" },
            { label: "Showing", value: scans ? filtered.length : "—" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-primary/10 bg-card px-4 py-3 shadow-xs">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-serif text-2xl font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your plants by name (e.g. Curry Leaf, Coconut, Mango, Rose)…"
              className="pl-10 rounded-xl"
              data-testid="history-search-input"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-56 rounded-xl" data-testid="history-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All Health Statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8">
          {scans === null ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-primary/20 bg-transparent" data-testid="history-empty">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <Sprout className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground max-w-md">
                  {loadError
                    ? `We couldn't load your scan history. ${loadError}`
                    : scans.length === 0
                    ? "No plants scanned yet. Take or upload your first photo on the Scan Plant page."
                    : "No saved scans match your search."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="history-grid">
              {filtered.map((s) => (
                <Card
                  key={s.id}
                  className="group overflow-hidden rounded-3xl border-primary/15 bg-card shadow-xs transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                  data-testid={`history-card-${s.id}`}
                >
                  <div className="relative h-44 overflow-hidden bg-secondary">
                    {s.image_base64 ? (
                      <img
                        src={s.image_base64}
                        alt={s.plant_name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/50 text-muted-foreground">
                        <Sprout className="h-8 w-8" />
                      </div>
                    )}
                    <Badge
                      className={`absolute left-3 top-3 rounded-full border backdrop-blur-md text-[10px] font-mono uppercase tracking-wider ${statusColor(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {s.plant_name || "Plant"}
                        </h4>
                        {s.scientific_name && (
                          <p className="font-serif italic text-xs text-muted-foreground truncate">
                            {s.scientific_name}
                          </p>
                        )}
                        {s.plant_family && (
                          <span className="inline-block mt-1 font-mono text-[9px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/15">
                            {s.plant_family}
                          </span>
                        )}
                        <p className="font-mono text-[10px] text-muted-foreground mt-1">
                          {new Date(s.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xl font-bold text-foreground">
                          {s.health_score}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
                          Health
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-primary/10 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                        onClick={() => openScan(s.id)}
                        data-testid={`view-scan-${s.id}`}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> View Report
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                        onClick={() => remove(s.id)}
                        data-testid={`delete-scan-${s.id}`}
                        title="Delete record"
                      >
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
        <DialogContent className="max-w-2xl rounded-3xl p-6" data-testid="scan-detail-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Plant Health Report</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            selected && <ScanResult scan={selected} />
          )}
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
