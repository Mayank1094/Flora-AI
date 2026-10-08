import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/components/ScanResult";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Leaf,
  ScanLine,
  ShieldCheck,
  Sprout,
  Camera,
  LineChart,
  ArrowRight,
  Compass,
  Sparkles,
  Droplets,
  Sun,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Heart,
  HelpCircle,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";
import { apiError } from "@/lib/api";

import {
  REAL_PLANT_PHOTOS,
  getPlantImage,
  INDIAN_SUBCONTINENT_PLANTS,
} from "@/lib/indianPlants";

export { REAL_PLANT_PHOTOS, getPlantImage };

// Interactive sample plant presets for demonstration
const INTERACTIVE_SPECIMENS = [
  {
    id: "curry-leaf",
    name: "Curry Leaf Plant",
    scientific: "Murraya koenigii (Kadi Patta)",
    part: "Leaves",
    status: "Pest Infestation",
    healthScore: 54,
    confidence: 94,
    sampleImage: REAL_PLANT_PHOTOS["Curry Leaf"],
    diagnosis:
      "Tiny sap-sucking bugs found on the leaves, causing leaf curling and sticky black spots.",
    issues: ["Tiny Leaf Bugs", "Curling Leaf Tips", "Black Powder on Leaves"],
    remedies: [
      "Spray 1 teaspoon of organic neem oil mixed with mild liquid soap and water in the evening.",
      "Wash off the bugs gently with a spray of water.",
      "Prune back heavily damaged curled shoots so fresh healthy leaves can grow.",
    ],
  },
  {
    id: "coconut",
    name: "Coconut Palm",
    scientific: "Cocos nucifera (Nariyal)",
    part: "Crown Fronds & Spindle",
    status: "Leaf Spot",
    healthScore: 68,
    confidence: 92,
    sampleImage: REAL_PLANT_PHOTOS["Coconut Palm"],
    diagnosis:
      "Brown oval spots observed on outer fronds caused by monsoon dampness. The center spear leaf remains firm and healthy.",
    issues: ["Brown Leaf Spots", "Moisture Stress", "Nutrient Wear"],
    remedies: [
      "Spray 1% organic Bordeaux mixture or copper solution over affected lower leaves.",
      "Add 1 kg organic wood ash or potash around the palm basin to strengthen frond cell walls.",
      "Ensure rainwater drains away freely from the base of the tree.",
    ],
  },
  {
    id: "mango",
    name: "Mango Tree",
    scientific: "Mangifera indica (Aam - Alphonso)",
    part: "Young Leaves & Twigs",
    status: "Blight",
    healthScore: 62,
    confidence: 95,
    sampleImage: REAL_PLANT_PHOTOS["Mango"],
    diagnosis:
      "Dark irregular spots on leaf tips caused by fungus during cloudy, humid weather.",
    issues: ["Dark Leaf Spots", "Tip Drying", "Humid Weather Stress"],
    remedies: [
      "Spray copper oxychloride (3g per liter) or organic neem extract on foliage.",
      "Prune crowded inner branches after harvest to let sunlight shine into the middle of the tree.",
      "Collect and dispose of fallen dry leaves around the tree base.",
    ],
  },
  {
    id: "hibiscus",
    name: "Hibiscus / Gudhal",
    scientific: "Hibiscus rosa-sinensis",
    part: "Flower Buds & Leaves",
    status: "Pest Infestation",
    healthScore: 48,
    confidence: 96,
    sampleImage: REAL_PLANT_PHOTOS["Hibiscus"],
    diagnosis:
      "White cottony bugs (mealybugs) clustered near flower buds and leaf joints, causing bud drop and curled leaves.",
    issues: ["White Cottony Mealybugs", "Bud Drop", "Sticky Sap"],
    remedies: [
      "Wipe clusters off with a cotton ball dipped in rubbing alcohol, or spray with neem oil soap solution.",
      "Rinse stems with a firm spray of clean water.",
      "Move the plant to a spot with at least 5 to 6 hours of bright direct sunshine daily.",
    ],
  },
  {
    id: "guava",
    name: "Guava Tree (Amrood)",
    scientific: "Psidium guajava",
    part: "Foliage & Developing Fruit",
    status: "Healthy",
    healthScore: 92,
    confidence: 97,
    sampleImage: REAL_PLANT_PHOTOS["Guava"],
    diagnosis:
      "Real living guava tree with lush green oval leaves and young developing guavas on branch. No leaf spot or fruit fly marks.",
    issues: ["Glossy green foliage", "Healthy Fruit Set"],
    remedies: [
      "Hang organic fruit fly traps in branches during fruiting season.",
      "Prune crossing inner twigs after harvest to let sunlight into the canopy.",
    ],
  },
  {
    id: "cinnamon",
    name: "Cinnamon Tree (Dalchini)",
    scientific: "Cinnamomum verum",
    part: "Canopy Leaves & Shoots",
    status: "Healthy",
    healthScore: 94,
    confidence: 96,
    sampleImage: REAL_PLANT_PHOTOS["Cinnamon"],
    diagnosis:
      "Living evergreen cinnamon tree with shiny leathery green leaves and reddish young flush shoots. Bushy and healthy.",
    issues: ["Vibrant leathery leaves", "Aromatic young flush"],
    remedies: [
      "Keep soil mulch moist under the tree and protect from harsh midday summer sun when young.",
      "Spray organic neem water once a season to keep leaf-mining caterpillars away.",
    ],
  },
  {
    id: "turmeric",
    name: "Turmeric Plant",
    scientific: "Curcuma longa (Haldi)",
    part: "Healthy Foliage & Stem",
    status: "Healthy",
    healthScore: 96,
    confidence: 98,
    sampleImage: REAL_PLANT_PHOTOS["Turmeric"],
    diagnosis:
      "Completely healthy plant. Deep green leaves with smooth edges and healthy, vibrant green growth.",
    issues: ["Healthy green leaves", "Strong Healthy Growth"],
    remedies: [
      "Mulch soil around the plant with dry leaves to retain moisture.",
      "Water moderately when top soil feels dry; avoid standing water.",
    ],
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [spices, setSpices] = useState(INDIAN_SUBCONTINENT_PLANTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSpecimen, setActiveSpecimen] = useState(INTERACTIVE_SPECIMENS[0]);
  const [isScanningSimulation, setIsScanningSimulation] = useState(false);
  const [modalSpice, setModalSpice] = useState(null);
  const [homeImage, setHomeImage] = useState(null);
  const [homeScan, setHomeScan] = useState(null);
  const [homeScanning, setHomeScanning] = useState(false);
  const [homeScanError, setHomeScanError] = useState("");
  const authed = user && typeof user === "object";

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#spices") {
      requestAnimationFrame(() => {
        document.getElementById("spices")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash, location.key, location.pathname]);

  useEffect(() => {
    api
      .get("/spices")
      .then((r) => {
        if (r.data?.spices?.length) {
          setSpices(r.data.spices);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPreset = (specimen) => {
    if (specimen.id === activeSpecimen.id) return;
    setIsScanningSimulation(true);
    setActiveSpecimen(specimen);
    setTimeout(() => {
      setIsScanningSimulation(false);
    }, 600);
  };

  const cta = () => navigate(authed ? "/dashboard" : "/signup");

  const readHomeImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setHomeScanError("Choose a plant photo in JPG, PNG, or WEBP format.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setHomeImage(reader.result);
      setHomeScan(null);
      setHomeScanError("");
    };
    reader.readAsDataURL(file);
  };

  const scanHomeImage = async () => {
    if (!authed) {
      navigate("/login", { state: { from: { pathname: "/dashboard", state: { scanImage: homeImage } } } });
      return;
    }
    if (!homeImage) return;
    setHomeScanning(true);
    setHomeScanError("");
    try {
      const { data } = await api.post("/scans", { image_base64: homeImage, plant_name: "" });
      setHomeScan(data.scan);
    } catch (error) {
      setHomeScanError(apiError(error));
    } finally {
      setHomeScanning(false);
    }
  };

  // Filter plants by simple everyday category tabs
  const categorizedSpices = spices.filter((s) => {
    if (selectedCategory === "all") return true;
    const cat = (s.category || "").toLowerCase();
    const name = s.name.toLowerCase();

    if (selectedCategory === "palms-fruits") {
      return (
        cat.includes("palm") ||
        cat.includes("fruit") ||
        name.includes("coconut") ||
        name.includes("mango") ||
        name.includes("banana") ||
        name.includes("guava") ||
        name.includes("papaya") ||
        name.includes("lemon") ||
        name.includes("pomegranate") ||
        name.includes("jackfruit") ||
        name.includes("bamboo") ||
        name.includes("areca") ||
        name.includes("palmyra")
      );
    }
    if (selectedCategory === "flowers") {
      return (
        cat.includes("flower") ||
        name.includes("hibiscus") ||
        name.includes("jasmine") ||
        name.includes("rose") ||
        name.includes("marigold") ||
        name.includes("bougainvillea") ||
        name.includes("champa") ||
        name.includes("lotus")
      );
    }
    if (selectedCategory === "spices") {
      return (
        cat.includes("spice") ||
        name.includes("curry") ||
        name.includes("cardamom") ||
        name.includes("turmeric") ||
        name.includes("pepper") ||
        name.includes("cinnamon") ||
        name.includes("clove") ||
        name.includes("ginger")
      );
    }
    if (selectedCategory === "medicinal") {
      return (
        cat.includes("medicinal") ||
        cat.includes("household") ||
        name.includes("tulsi") ||
        name.includes("neem") ||
        name.includes("aloe") ||
        name.includes("giloy") ||
        name.includes("money plant")
      );
    }
    return true;
  });

  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7 animate-fade-up">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary dark:border-accent/30 dark:bg-accent/10 dark:text-accent"
                data-testid="hero-badge"
              >
                <Sprout className="h-3.5 w-3.5 text-accent" />
                <span>Smart Plant Doctor • Made for Indian Plants</span>
              </div>

              <h1 className="mt-6 font-serif text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
                Keep your plants healthy with{" "}
                <span className="italic font-normal text-primary dark:text-primary underline decoration-accent/40 decoration-wavy decoration-2">
                  instant AI checks
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                Tuned specifically for Indian plants — coconut palms, mango trees, courtyard flowers,
                kitchen spices, and healing herbs. Simply snap a photo to find out what's wrong and get
                easy, natural remedies to protect your plants.
              </p>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  onClick={cta}
                  size="lg"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-sm transition-all hover:opacity-95 hover:shadow-md hover:shadow-primary/20"
                  data-testid="hero-cta-button"
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  {authed ? "Open Plant Scanner" : "Scan a Plant Now"}
                </Button>
                <a
                  href="#scanner-demo"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary/60 hover:border-primary/40"
                  data-testid="hero-login-button"
                >
                  <Compass className="h-4 w-4 text-primary" />
                  View sample report
                </a>
              </div>

              {/* Stats row */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-primary/10 pt-6 sm:grid-cols-4">
                <div>
                  <p className="font-mono text-xl font-bold text-foreground">28+</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Indian Plants
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-foreground">50+</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Diseases & Pests
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-foreground">100%</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Organic Remedies
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-accent">Smart Vision</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    AI Doctor
                  </p>
                </div>
              </div>
            </div>

            {/* Showcase Visual Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl border border-primary/15 bg-card p-4 shadow-xl herbarium-glass">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/10 pb-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      REAL INDIAN PLANT PHOTO
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary font-semibold">
                    Coconut Palm
                  </span>
                </div>

                {/* Real-life image with focus brackets */}
                <div className="relative mt-3 h-72 w-full overflow-hidden rounded-2xl bg-muted/40">
                  <img
                    src={REAL_PLANT_PHOTOS["Coconut Palm"]}
                    alt="Real life coconut palm"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Focus brackets */}
                  <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl">
                    <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-accent" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-accent" />
                    <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-accent" />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-accent" />
                  </div>
                  {/* Live health pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md px-3 py-1.5 shadow-md">
                    <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
                    <span className="font-mono text-xs font-bold text-foreground">Health: 95/100</span>
                    <span className="font-mono text-[10px] text-muted-foreground">· Healthy Palm</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-3 pt-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      Coconut Palm (Nariyal)
                    </h3>
                    <span className="font-serif italic text-xs text-muted-foreground">
                      Cocos nucifera
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Revered as 'Kalpavriksha' across India. Provides sweet water, healthy cooking oil,
                    and natural coir fiber.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO SCANNER */}
      <section id="scanner" className="border-y border-primary/10 bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              <ScanLine className="h-4 w-4 text-accent" /> Plant health check
            </div>
            <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl">A clearer picture of plant health</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Upload a close photo of a leaf, stem, or whole plant. FLORAai checks for visible signs of disease, pests, or stress and gives you a practical care report.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-primary/10 bg-background px-3 py-1.5">JPG, PNG, WEBP</span>
              <span className="rounded-full border border-primary/10 bg-background px-3 py-1.5">Private scan history</span>
            </div>
          </div>
          <Card className="overflow-hidden rounded-3xl border-primary/15 bg-card shadow-lg">
            <CardContent className="p-5 sm:p-7">
              <input type="file" accept="image/*" capture="environment" className="hidden" id="home-plant-photo" onChange={(event) => readHomeImage(event.target.files?.[0])} />
              {homeImage ? (
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <img src={homeImage} alt="Selected plant for health scan" className="max-h-[420px] w-full object-contain" />
                  <button type="button" onClick={() => { setHomeImage(null); setHomeScan(null); }} aria-label="Remove photo" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <label htmlFor="home-plant-photo" className="group flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-secondary/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-secondary/50">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><UploadCloud className="h-7 w-7" /></span>
                  <span className="mt-4 font-serif text-lg font-medium text-foreground">Add a clear plant photo</span>
                  <span className="mt-1 text-xs text-muted-foreground">Choose from your device or take a photo</span>
                  <span className="mt-5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Choose photo</span>
                </label>
              )}
              {homeScanError && <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{homeScanError}</p>}
              {homeImage && !homeScan && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">{authed ? "Ready to check this plant." : "Sign in to analyse this photo and save its report."}</p>
                  <Button onClick={scanHomeImage} disabled={homeScanning} className="rounded-full px-6">
                    {homeScanning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</> : <><ScanLine className="mr-2 h-4 w-4" /> {authed ? "Check plant health" : "Sign in to scan"}</>}
                  </Button>
                </div>
              )}
              {homeScan && <div className="mt-5"><ScanResult scan={homeScan} /></div>}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* INTERACTIVE DEMONSTRATION SECTION */}
      <section id="scanner-demo" className="relative border-y border-primary/10 bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <span>Interactive Plant Doctor Demo</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              See How It Checks Your Plants
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Tap any plant below to see how our AI identifies problems and provides simple organic remedies:
            </p>

            {/* Specimen switcher buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {INTERACTIVE_SPECIMENS.map((s) => {
                const active = s.id === activeSpecimen.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectPreset(s)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-primary/15 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{s.name}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        s.status === "Healthy" ? "bg-accent" : "bg-[hsl(14_62%_48%)]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Viewport: Camera / Image + Report */}
          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Left Photo View */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-primary/20 bg-black/90 p-3 shadow-xl">
                <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl bg-neutral-900">
                  <img
                    src={activeSpecimen.sampleImage}
                    alt={activeSpecimen.name}
                    className={`h-full w-full object-cover transition-all duration-700 ${
                      isScanningSimulation ? "scale-105 filter blur-xs" : "scale-100 filter-none"
                    }`}
                  />

                  {/* Optical Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-white/80 font-mono text-[10px] tracking-widest uppercase">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                        AI SCANNER READY
                      </span>
                      <span>FOCUS: {activeSpecimen.part}</span>
                    </div>

                    {/* Scanning Beam */}
                    <div className="absolute inset-x-0 h-1 scan-beam animate-scan-sweep pointer-events-none" />

                    {/* Viewfinder Corner Brackets */}
                    <div className="absolute inset-8 border border-white/20 rounded-xl">
                      <div className="absolute -top-1.5 -left-1.5 h-4 w-4 border-t-2 border-l-2 border-accent" />
                      <div className="absolute -top-1.5 -right-1.5 h-4 w-4 border-t-2 border-r-2 border-accent" />
                      <div className="absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b-2 border-l-2 border-accent" />
                      <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b-2 border-r-2 border-accent" />
                    </div>

                    <div className="flex items-end justify-between text-white font-mono text-[11px]">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1">
                        ACCURACY: {activeSpecimen.confidence}%
                      </div>
                      <div className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1">
                        SCIENTIFIC NAME: <span className="italic">{activeSpecimen.scientific}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between px-2 text-xs text-white/70">
                  <span className="font-mono text-[11px] text-accent font-semibold">REAL PLANT PHOTO</span>
                  <Button
                    size="sm"
                    onClick={cta}
                    className="h-8 rounded-full bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90"
                  >
                    <Camera className="mr-1.5 h-3.5 w-3.5" />
                    Scan Your Plant Photo
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Health Report Card */}
            <div className="lg:col-span-6">
              <div className="h-full rounded-3xl border border-primary/15 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between border-b border-primary/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          PLANT REPORT
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          VERIFIED
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-2xl font-medium text-foreground">
                        {activeSpecimen.name}
                      </h3>
                      <p className="font-serif italic text-xs text-muted-foreground">
                        {activeSpecimen.scientific}
                      </p>
                    </div>

                    {/* Health score */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span
                          className={`text-3xl font-bold ${
                            activeSpecimen.healthScore >= 70
                              ? "text-primary"
                              : "text-[hsl(14_62%_48%)]"
                          }`}
                        >
                          {activeSpecimen.healthScore}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        Health Score
                      </span>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/10 bg-secondary/40 p-3">
                    <div className="flex items-center gap-2.5">
                      {activeSpecimen.status === "Healthy" ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-[hsl(14_62%_48%)]" />
                      )}
                      <div>
                        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Condition: {activeSpecimen.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accuracy: {activeSpecimen.confidence}% match
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wider"
                    >
                      {activeSpecimen.part}
                    </Badge>
                  </div>

                  {/* Diagnosis description */}
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-foreground/80">
                    {activeSpecimen.diagnosis}
                  </p>

                  {/* Observed issues */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                      Signs Observed
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeSpecimen.issues.map((issue) => (
                        <span
                          key={issue}
                          className="rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary dark:text-primary"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Organic remedies */}
                  <div className="mt-5 border-t border-primary/10 pt-4">
                    <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                      <Leaf className="h-3 w-3 text-accent" />
                      Natural Home Remedies to Fix It
                    </p>
                    <div className="mt-2.5 space-y-2">
                      {activeSpecimen.remedies.map((remedy, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/80">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[9px] font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{remedy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 border-t border-primary/10 pt-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    100% Natural Organic Care
                  </span>
                  <Button
                    onClick={cta}
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-primary hover:text-primary/80 p-0 hover:bg-transparent"
                  >
                    Check your own plant <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANT CATALOG SECTION WITH REAL-LIFE PHOTOS */}
      <section id="spices" className="scroll-mt-24 py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              <Compass className="h-3.5 w-3.5 text-accent" />
              <span>Plant Library</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              Common Plants Grown Across India
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Browse real-life photos, care tips, common diseases, and natural home remedies for fruit trees,
              palms, flowers, spices, and healing plants.
            </p>
            <a className="mt-2 inline-block text-xs text-primary underline underline-offset-4" href="/plants/credits.json" target="_blank" rel="noreferrer">
              View photo sources and licenses
            </a>
          </div>

          {/* Simple filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Plants" },
              { id: "palms-fruits", label: "Fruits & Palms" },
              { id: "flowers", label: "Flowers" },
              { id: "spices", label: "Spices" },
              { id: "medicinal", label: "Medicinal & Home" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-primary/10 bg-background text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real Plant Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categorizedSpices.map((s) => {
            const photoUrl = getPlantImage(s.name);
            const commonName = s.name.split("(")[0].trim();
            const scientificName = s.name.includes("(")
              ? s.name.split("(")[1].replace(")", "")
              : "";

            return (
              <div
                key={s.name}
                onClick={() => setModalSpice(s)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-primary/15 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
                data-testid={`plant-card-${commonName.split(" ")[0].toLowerCase()}`}
              >
                {/* Real photographic image */}
                <div className="relative h-60 overflow-hidden bg-muted">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div role="img" aria-label={`Photo unavailable for ${s.name}`} className="flex h-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
                      <Sprout className="h-8 w-8" />
                      <span className="text-xs">Photo unavailable</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Real Photo badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-accent/95 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-foreground font-bold shadow-xs">
                    REAL PHOTO
                  </div>

                  {/* Family badge */}
                  {s.family && (
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-white border border-white/15">
                      {s.family.split("(")[0].trim()}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="font-serif italic text-xs text-white/90 drop-shadow-xs">
                      {scientificName}
                    </p>
                  </div>
                </div>

                {/* Card description */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                      {commonName}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  {s.role && (
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-serif">
                      {s.role}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.common_issues.slice(0, 2).map((issue) => (
                      <span
                        key={issue}
                        className="rounded-full bg-secondary/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-secondary-foreground"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono text-[10px] text-primary font-semibold">
                      NATURAL CARE
                    </span>
                    <span className="text-[11px] font-medium text-primary">View Guide & Remedies →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detail Dialog for Plant Card */}
      {modalSpice && (
        <Dialog open={!!modalSpice} onOpenChange={(o) => !o && setModalSpice(null)}>
          <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                <Leaf className="h-3.5 w-3.5 text-accent" />
                <span>PLANT CARE GUIDE</span>
              </div>
              <DialogTitle className="font-serif text-2xl font-medium mt-1">
                {modalSpice.name}
              </DialogTitle>
              <DialogDescription className="font-serif italic text-xs text-muted-foreground">
                {modalSpice.scientific_name || modalSpice.name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {/* Real-life image in dialog */}
              <div className="h-64 w-full overflow-hidden rounded-2xl bg-neutral-900 relative">
                {getPlantImage(modalSpice.name) ? (
                  <img
                    src={getPlantImage(modalSpice.name)}
                    alt={modalSpice.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div role="img" aria-label={`Photo unavailable for ${modalSpice.name}`} className="flex h-full flex-col items-center justify-center gap-2 text-white/70">
                    <Sprout className="h-8 w-8" />
                    <span className="text-xs">Photo unavailable</span>
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-wider font-bold">
                  REAL-LIFE PHOTOGRAPH
                </Badge>
                {modalSpice.family && (
                  <Badge className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider">
                    Family: {modalSpice.family}
                  </Badge>
                )}
              </div>

              {modalSpice.role && (
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                    Role & Uses in India (Why this plant is valuable)
                  </h4>
                  <p className="mt-1.5 text-xs text-foreground/90 font-serif leading-relaxed">
                    {modalSpice.role}
                  </p>
                </div>
              )}

              {modalSpice.description && (
                <div className="rounded-2xl border border-primary/10 bg-secondary/30 p-4">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    About this Plant
                  </h4>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                    {modalSpice.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Common Problems & Sicknesses
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {modalSpice.common_issues.map((i) => (
                    <span
                      key={i}
                      className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {modalSpice.problem_cause && (
                <div className="rounded-2xl border border-[hsl(14_62%_48%)]/20 bg-[hsl(14_62%_48%)]/5 p-4">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-[hsl(14_62%_48%)] font-bold">
                    What Happens to this Plant (Why it gets sick)
                  </h4>
                  <p className="mt-1 text-xs text-foreground/85 leading-relaxed">
                    {modalSpice.problem_cause}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-primary/15 bg-secondary/30 p-4">
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                  Natural Organic Remedies to Fix It
                </h4>
                <div className="mt-2 space-y-1.5">
                  {Array.isArray(modalSpice.remedies) ? (
                    modalSpice.remedies.map((rem, i) => (
                      <p key={i} className="text-xs text-foreground/90 leading-relaxed">
                        • {rem}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {modalSpice.remedies}
                    </p>
                  )}
                </div>
              </div>

              {modalSpice.precautions && modalSpice.precautions.length > 0 && (
                <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-4">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
                    Conclusion: Simple Steps to Keep this Plant Safe & Healthy
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    {modalSpice.precautions.map((p, i) => (
                      <p key={i} className="text-xs text-foreground/90 leading-relaxed">
                        ✓ {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-full" onClick={() => setModalSpice(null)}>
                  Close
                </Button>
                <Button className="rounded-full bg-primary text-primary-foreground" onClick={cta}>
                  Scan a Photo of this Plant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 3 Simple Steps Section */}
      <section id="methodology" className="border-t border-primary/10 bg-secondary/20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              <Sprout className="h-3.5 w-3.5 text-accent" />
              <span>Easy 3-Step Process</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              How FLORAai Helps You Care for Your Plants
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No complicated tools or harsh chemicals needed. Here is how we make plant health easy for everyone:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Camera,
                title: "1. Snap a Leaf or Plant Photo",
                subtitle: "Use phone camera or upload",
                text: "Point your camera at yellowing leaves, brown spots, or pests. Our AI scans the photo instantly.",
              },
              {
                step: "02",
                icon: LineChart,
                title: "2. Detects the Exact Problem",
                subtitle: "Identifies disease, bug, or water issue",
                text: "Tells you whether your plant has fungus, bugs, poor drainage, or nutrient deficiency.",
              },
              {
                step: "03",
                icon: Leaf,
                title: "3. Simple Home Remedies & Tips",
                subtitle: "100% natural, safe, and organic",
                text: "Gives easy recipes like neem oil spray, proper watering schedules, and preventive precautions to protect your plant.",
              },
            ].map((card) => (
              <Card
                key={card.step}
                className="rounded-3xl border-primary/15 bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary dark:bg-accent/10 dark:text-accent">
                      <card.icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-2xl font-bold text-muted-foreground/40">
                      {card.step}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-xl font-medium text-foreground">
                    {card.title}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold mt-1">
                    {card.subtitle}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Band */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 sm:px-16 text-primary-foreground shadow-xl">
          <Leaf className="absolute -right-8 -bottom-8 h-64 w-64 text-white/5 pointer-events-none" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Free Plant Care</span>
            </span>
            <h2 className="mt-4 font-serif text-3xl font-medium sm:text-4xl text-white leading-tight">
              {authed
                ? "Ready to check another plant?"
                : "Save your plant photos and health reports"}
            </h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              {authed
                ? "Go to the scanner to take a photo of any sick plant or review your past scan history."
                : "Create a free account to track your plants, save health reports, and keep your home garden green and healthy."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                onClick={cta}
                size="lg"
                className="rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
                data-testid="cta-band-button"
              >
                {authed ? "Go to Plant Scanner" : "Get Started for Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {!authed && (
                <Link
                  to="/login"
                  className="text-xs font-medium text-white/70 underline underline-offset-4 hover:text-white"
                >
                  Already have an account? Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
