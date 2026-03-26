"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";

interface PricingSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    plans: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      cta: { label: string; href: string };
      highlighted?: boolean;
      badge?: string;
    }[];
  };
}

export function PricingSection({ data }: PricingSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const gridRef = useGsapStagger();

  return (
    <section id="harga" className="py-20 sm:py-28">
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
            {data.headline}
          </h2>
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            {data.subheadline}
          </p>
        </div>

        {/* Pricing cards */}
        <div
          ref={gridRef}
          className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2"
        >
          {data.plans.map((plan) => (
            <div
              key={plan.name}
              data-gsap-stagger
              className={cn(
                "relative rounded-xl border p-6 sm:p-8",
                plan.highlighted
                  ? "border-primary bg-primary/[0.02]"
                  : "border-border bg-card"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  {plan.badge}
                </div>
              )}

              <h3 className="font-heading text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={plan.cta.href}
                  className={cn(
                    buttonVariants({
                      variant: plan.highlighted ? "default" : "outline",
                      size: "lg",
                    }),
                    "w-full"
                  )}
                >
                  {plan.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
