import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ScanLine,
  ShieldCheck,
  Sprout,
  Camera,
  LineChart,
  ArrowRight,
  Lock,
} from "lucide-react";

const SPICE_IMAGES = {
  "Curry Leaf Plant (Murraya koenigii)":
    "https://images.unsplash.com/photo-1689919450548-d6041ffad25b?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  "Cardamom (Elettaria cardamomum)":
    "https://images.unsplash.com/photo-1732548289716-bddbdfc16a9f?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  "Turmeric (Curcuma longa)":
    "https://images.unsplash.com/photo-1750182315615-fc30eb55d0e3?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  "Black Pepper (Piper nigrum)":
    "https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  "Cinnamon (Cinnamomum verum)":
    "https://images.unsplash.com/photo-1533038023143-de7a62a9d779?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  "Clove (Syzygium aromaticum)":
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spices, setSpices] = useState([]);
  const authed = user && typeof user === "object";

  useEffect(() => {
    api.get("/spices").then((r) => setSpices(r.data.spices)).catch(() => {});
  }, []);

  const cta = () => navigate(authed ? "/dashboard" : "/signup");

  return (
    <Shell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1779749778645-01ea66a4030a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600"
            alt="Dense spice foliage"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(103_51%_8%)]/95 via-[hsl(103_51%_12%)]/85 to-[hsl(103_51%_15%)]/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <Badge className="mb-5 rounded-full border-accent/30 bg-accent/10 text-accent hover:bg-accent/10" data-testid="hero-badge">
              <Sprout className="mr-1.5 h-3.5 w-3.5" /> AI diagnostics for Indian spice plants
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know what ails your{" "}
              <span className="text-accent">spice plants</span> — before it spreads.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Snap a leaf of your curry plant, cardamom, turmeric or pepper vine. FLORAai returns a
              health score, likely disease, and an organic remedy plan in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={cta} size="lg" className="rounded-full bg-accent text-primary hover:bg-[hsl(84_90%_72%)]" data-testid="hero-cta-button">
                <ScanLine className="mr-2 h-5 w-5" />
                {authed ? "Open dashboard" : "Start scanning free"}
              </Button>
              {!authed && (
                <Button onClick={() => navigate("/login")} size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white" data-testid="hero-login-button">
                  I already have an account
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Camera, title: "Capture or upload", text: "Use your camera or upload a photo of the affected leaf, stem or rhizome." },
            { icon: LineChart, title: "AI health report", text: "Get a 0–100 health score, probable disease, confidence level and remedy steps." },
            { icon: ShieldCheck, title: "Private history", text: "Every scan is saved privately to your account so you can track recovery over time." },
          ].map((f, i) => (
            <Card key={f.title} className="border-primary/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CardContent className="p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-accent">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Spice gallery */}
      <section id="spices" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(14_63%_44%)]">
            Supported crops
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Tuned for subcontinent spices
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spices.map((s) => (
            <div key={s.name} className="group overflow-hidden rounded-2xl border border-primary/10 bg-card" data-testid={`spice-card-${s.name.split(" ")[0].toLowerCase()}`}>
              <div className="h-44 overflow-hidden">
                <img
                  src={SPICE_IMAGES[s.name] || SPICE_IMAGES["Clove (Syzygium aromaticum)"]}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-foreground">{s.name}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.common_issues.slice(0, 3).map((issue) => (
                    <span key={issue} className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-secondary-foreground">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 sm:p-16">
          <Leaf className="absolute -right-6 -top-6 h-40 w-40 text-accent/10" />
          <div className="relative max-w-xl">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              {authed ? "Ready for your next scan?" : "Create a free account to save your scans"}
            </h2>
            <p className="mt-3 text-white/70">
              {authed
                ? "Head to your dashboard and upload a new plant photo."
                : "You can browse freely, but sign in to save reports, build history and manage preferences."}
            </p>
            <Button onClick={cta} size="lg" className="mt-7 rounded-full bg-accent text-primary hover:bg-[hsl(84_90%_72%)]" data-testid="cta-band-button">
              {authed ? "Go to dashboard" : "Get started"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {!authed && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-white/50">
                <Lock className="h-3.5 w-3.5" /> Protected features require an account.{" "}
                <Link to="/login" className="underline hover:text-accent">Log in</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
