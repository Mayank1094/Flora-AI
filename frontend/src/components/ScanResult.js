import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

export function statusColor(status) {
  if (status === "Healthy") return "text-primary bg-primary/10 border-primary/20";
  if (status === "Unknown") return "text-muted-foreground bg-muted border-border";
  return "text-[hsl(14_63%_44%)] bg-[hsl(14_63%_44%)]/10 border-[hsl(14_63%_44%)]/20";
}

export function scoreColor(score) {
  if (score >= 75) return "hsl(103 51% 25%)";
  if (score >= 45) return "hsl(38 78% 50%)";
  return "hsl(14 63% 44%)";
}

export function HealthGauge({ score }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-32 w-32" data-testid="health-gauge">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold text-foreground">{score}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Health
        </span>
      </div>
    </div>
  );
}

export function ScanResult({ scan }) {
  if (!scan) return null;
  const healthy = scan.status === "Healthy";
  return (
    <Card className="overflow-hidden border-primary/15 animate-fade-up" data-testid="scan-result">
      <CardContent className="p-0">
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          {scan.image_base64 && (
            <div className="relative h-56 md:h-auto">
              <img src={scan.image_base64} alt={scan.plant_name} className="h-full w-full object-cover" />
              <Badge className={`absolute left-4 top-4 rounded-full border ${statusColor(scan.status)}`} data-testid="scan-status-badge">
                {healthy ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
                {scan.status}
              </Badge>
            </div>
          )}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground" data-testid="scan-plant-name">
                  {scan.plant_name || "Plant"}
                </h3>
                {scan.scientific_name && (
                  <p className="font-mono text-xs italic text-muted-foreground">{scan.scientific_name}</p>
                )}
              </div>
              <HealthGauge score={scan.health_score} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{scan.diagnosis}</p>

            <div className="mt-4 flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Confidence
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${scan.confidence}%` }} />
              </div>
              <span className="font-mono text-xs font-semibold text-foreground">{scan.confidence}%</span>
            </div>

            {scan.issues?.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Detected issues</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {scan.issues.map((i) => (
                    <span key={i} className="rounded-full bg-[hsl(14_63%_44%)]/10 px-2.5 py-1 text-xs text-[hsl(14_63%_44%)]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {scan.remedies?.length > 0 && (
              <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary dark:text-accent">
                  <Leaf className="h-3.5 w-3.5" /> Recommended remedies
                </p>
                <ul className="mt-2 space-y-1.5">
                  {scan.remedies.map((r, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                      <span className="mt-0.5 text-primary dark:text-accent">›</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scan.is_mock && (
              <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Sample analysis (AI model unavailable — showing reference data).
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
