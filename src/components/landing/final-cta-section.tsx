"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGsapScrollTrigger } from "@/lib/hooks/use-gsap";

interface FinalCtaSectionProps {
  data: {
    headline: string;
    subheadline: string;
    cta: { label: string; href: string };
    note: string;
  };
}

export function FinalCtaSection({ data }: FinalCtaSectionProps) {
  const sectionRef = useGsapScrollTrigger();

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* Background decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <div className="relative">
            <h2
              data-gsap="fade-up"
              className="font-[family-name:var(--font-instrument-serif)] text-3xl font-medium tracking-normal text-foreground sm:text-4xl"
            >
              {data.headline}
            </h2>
            <p
              data-gsap="fade-up"
              data-gsap-delay="0.1"
              className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
            >
              {data.subheadline}
            </p>
            <div data-gsap="fade-up" data-gsap-delay="0.2" className="mt-8">
              <Link
                href={data.cta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 px-8 text-base",
                )}
              >
                {data.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p
              data-gsap="fade"
              data-gsap-delay="0.3"
              className="mt-4 text-xs text-muted-foreground"
            >
              {data.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
