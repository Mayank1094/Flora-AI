import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const FACTS = [
  "Cardamom is called the “Queen of Spices” and thrives in the shaded Western Ghats.",
  "Turmeric’s active compound, curcumin, gives it both colour and antifungal power.",
  "Black pepper vines can climb over 4 metres on supporting trees.",
  "Curry leaf plants repel pests naturally thanks to their aromatic oils.",
  "Ceylon cinnamon bark is harvested from shoots only two years old.",
];

export function AuthLayout({ title, subtitle, children, footer, testid }) {
  const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
  return (
    <div className="flex min-h-screen bg-background leaf-texture" data-testid={testid}>
      {/* Left botanical panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
          alt="Lush botanical foliage"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(103_51%_8%)] via-[hsl(103_51%_12%)]/70 to-[hsl(103_51%_15%)]/30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Leaf className="h-6 w-6 text-primary" />
            </span>
            <span className="font-serif text-2xl font-bold text-accent">
              FLORA<span className="text-[hsl(38_78%_66%)]">ai</span>
            </span>
          </Link>
          <div className="max-w-md">
            <h2 className="font-serif text-4xl font-bold leading-tight text-white">
              Diagnose your spice plants in seconds.
            </h2>
            <p className="mt-4 text-white/70">
              Upload a leaf, get an AI health report tuned for Indian subcontinent spices.
            </p>
            <div className="mt-8 rounded-2xl border border-accent/20 bg-black/20 p-5 backdrop-blur-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">
                Did you know?
              </p>
              <p className="mt-2 text-sm text-white/85">{fact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Leaf className="h-5 w-5 text-accent" />
            </span>
            <span className="font-serif text-xl font-bold text-primary dark:text-accent">
              FLORA<span className="text-[hsl(14_63%_44%)]">ai</span>
            </span>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
