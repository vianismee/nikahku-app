"use client";

import {
  Wallet,
  Store,
  Users,
  Gift,
  ClipboardCheck,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Store,
  Users,
  Gift,
  ClipboardCheck,
  Heart,
};

interface FeaturesSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    items: {
      icon: string;
      title: string;
      description: string;
      highlights: string[];
    }[];
  };
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const gridRef = useGsapStagger();

  return (
    <section id="fitur" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mx-auto max-w-2xl text-center">
          <div
            data-gsap="fade-down"
            className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            {data.badge}
          </div>
          <h2
            data-gsap="fade-up"
            data-gsap-delay="0.1"
            className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal tracking-tight text-foreground sm:text-4xl"
          >
            Semua yang Kamu Butuhkan untuk{" "}
            <span className="italic text-primary">Hari Istimewamu</span>
          </h2>
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            {data.subheadline}
          </p>
        </div>

        {/* Feature grid */}
        <div
          ref={gridRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.items.map((item) => {
            const Icon = iconMap[item.icon] || Heart;
            return (
              <div
                key={item.title}
                data-gsap-stagger
                className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="mb-4 inline-flex rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
