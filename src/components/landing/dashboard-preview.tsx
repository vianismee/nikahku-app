"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapScrollTrigger } from "@/lib/hooks/use-gsap";

gsap.registerPlugin(ScrollTrigger);

export function DashboardPreview() {
  const sectionRef = useGsapScrollTrigger();
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frameRef.current) return;

    gsap.fromTo(
      frameRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative -mt-4 pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          ref={frameRef}
          className="relative rounded-xl border border-border bg-card p-1.5 sm:p-2"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 rounded-t-lg border-b border-border bg-muted/50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-secondary/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
            </div>
            <div className="mx-auto flex-1 max-w-xs">
              <div className="flex items-center gap-2 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                nikahku.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="rounded-b-lg bg-background p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Stat cards */}
              {[
                { label: "Total Budget", value: "Rp 150.000.000", color: "bg-primary/10 text-primary" },
                { label: "Terpakai", value: "Rp 87.500.000", color: "bg-secondary/10 text-secondary" },
                { label: "Sisa", value: "Rp 62.500.000", color: "bg-accent/10 text-accent" },
              ].map((card) => (
                <div key={card.label} className="rounded-lg border border-border p-3 sm:p-4">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className={`mt-1 font-mono text-sm font-bold sm:text-base ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart mockup */}
            <div className="mt-4 rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">Alokasi Budget</p>
                <div className="flex gap-2">
                  {["Katering", "Dekorasi", "Foto"].map((l) => (
                    <span key={l} className="text-[10px] text-muted-foreground">{l}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2 h-24 sm:h-32">
                {[65, 45, 80, 35, 55, 70, 40].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-primary/20 transition-all hover:bg-primary/40" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Table mockup */}
            <div className="mt-4 rounded-lg border border-border">
              <div className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
                <span>Vendor</span>
                <span>Kategori</span>
                <span>Harga</span>
                <span>Status</span>
              </div>
              {[
                { name: "Dewi Catering", cat: "Katering", price: "Rp 45jt", status: "Booked", color: "bg-primary/10 text-primary" },
                { name: "Bali Decor", cat: "Dekorasi", price: "Rp 30jt", status: "Nego", color: "bg-secondary/10 text-secondary" },
                { name: "Lens Studio", cat: "Fotografi", price: "Rp 15jt", status: "Review", color: "bg-accent/10 text-accent" },
              ].map((row) => (
                <div key={row.name} className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[10px] sm:text-xs last:border-0">
                  <span className="font-medium text-foreground truncate">{row.name}</span>
                  <span className="text-muted-foreground">{row.cat}</span>
                  <span className="font-mono text-foreground">{row.price}</span>
                  <span>
                    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium ${row.color}`}>
                      {row.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
