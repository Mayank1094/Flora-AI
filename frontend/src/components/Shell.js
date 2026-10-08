import React from "react";
import { Navbar, Footer } from "@/components/Navbar";

export function Shell({ children, withFooter = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-background leaf-texture">
      <Navbar />
      <main className="flex-1">{children}</main>
      {withFooter && <Footer />}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
