"use client";

import { Star } from "lucide-react";
import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";

interface TestimonialsSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    items: {
      name: string;
      location: string;
      text: string;
      rating: number;
    }[];
  };
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const gridRef = useGsapStagger();

  return (
    <section id="testimoni" className="py-20 sm:py-28">
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
            Cerita dari{" "}
            <span className="italic text-primary">Pasangan Bahagia</span>
          </h2>
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            {data.subheadline}
          </p>
        </div>

        {/* Testimonial cards */}
        <div
          ref={gridRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.items.map((item) => (
            <div
              key={item.name}
              data-gsap-stagger
              className="rounded-xl border border-border bg-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                &ldquo;{item.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
