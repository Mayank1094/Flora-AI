import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Shell, PageHeader } from "@/components/Shell";
import { ScanResult, statusColor } from "@/components/ScanResult";
import { useAuth } from "@/context/AuthContext";
import api, { apiError } from "@/lib/api";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadCloud, Loader2, ScanLine, X, History, MailWarning } from "lucide-react";
import { toast } from "sonner";

const SPICE_OPTIONS = ["Curry Leaf", "Cardamom", "Turmeric", "Black Pepper", "Clove", "Cinnamon", "Other / Unsure"];

export default function Dashboard() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [plant, setPlant] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  const loadRecent = () =>
    api.get("/users/me/history").then((r) => setRecent(r.data.scans.slice(0, 4))).catch(() => {});

  useEffect(() => {
    loadRecent();
  }, []);

  const onFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG or WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setResult(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const scan = async () => {
    if (!image) {
      setError("Upload a plant photo to scan.");
      return;
    }
    setScanning(true);
    setError("");
    try {
      const { data } = await api.post("/scans", {
        image_base64: image,
        plant_name: plant === "Other / Unsure" ? "" : plant,
      });
      setResult(data.scan);
      toast.success("Analysis complete.");
      loadRecent();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setPlant("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow={`Welcome, ${user.name.split(" ")[0]}`}
          title="Plant health dashboard"
          description="Capture or upload a photo of your spice plant to get an instant AI diagnosis."
          action={
            <Button asChild variant="outline" className="rounded-full" data-testid="dashboard-history-button">
              <Link to="/history"><History className="mr-2 h-4 w-4" /> View full history</Link>
            </Button>
          }
        />

        {user.email_verified === false && (
          <Alert className="mt-6 border-[hsl(38_78%_50%)]/40 bg-[hsl(38_78%_50%)]/10" data-testid="verify-banner">
            <MailWarning className="h-4 w-4 text-[hsl(38_78%_40%)]" />
            <AlertDescription className="text-foreground">
              Your email isn’t verified yet.{" "}
              <Link to="/verify-email" className="font-semibold underline">Verify now</Link> to secure your account.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Scanner */}
          <div className="space-y-5">
            <Card className="border-primary/15">
              <CardContent className="p-6">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                  data-testid="plant-upload-input"
                />
                {!image ? (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-secondary/30 py-14 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                    data-testid="upload-dropzone"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-accent">
                      <UploadCloud className="h-8 w-8" />
                    </span>
                    <span className="font-serif text-lg font-semibold text-foreground">Upload a plant photo</span>
                    <span className="text-sm text-muted-foreground">Click to browse or use your camera · JPEG, PNG, WEBP</span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img src={image} alt="Selected plant" className="max-h-80 w-full object-cover" data-testid="preview-image" />
                    <button
                      onClick={reset}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                      data-testid="clear-image-button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Select value={plant} onValueChange={setPlant}>
                    <SelectTrigger className="sm:w-56" data-testid="dashboard-spice-select">
                      <SelectValue placeholder="Which plant? (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={scan}
                    disabled={scanning || !image}
                    className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]"
                    data-testid="scan-button"
                  >
                    {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                    {scanning ? "Analyzing plant…" : "Analyze plant health"}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-4" data-testid="scan-error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {result && <ScanResult scan={result} />}
          </div>

          {/* Recent */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">Recent reports</h3>
            <div className="mt-4 space-y-3" data-testid="recent-scans">
              {recent.length === 0 ? (
                <Card className="border-dashed border-primary/20 bg-transparent">
                  <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                    <ScanLine className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No scans yet. Upload a photo to get started.</p>
                  </CardContent>
                </Card>
              ) : (
                recent.map((s) => (
                  <Link key={s.id} to={`/history?scan=${s.id}`} className="block" data-testid={`recent-scan-${s.id}`}>
                    <Card className="border-primary/10 transition-colors hover:border-primary/30">
                      <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{s.plant_name || "Plant"}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {new Date(s.created_at).toLocaleDateString()} · {s.health_score}/100
                          </p>
                        </div>
                        <Badge className={`rounded-full border ${statusColor(s.status)}`}>{s.status}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
