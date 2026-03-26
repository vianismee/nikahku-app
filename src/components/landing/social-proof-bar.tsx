"use client";

import { useGsapScrollTrigger } from "@/lib/hooks/use-gsap";

interface SocialProofBarProps {
  data: {
    title: string;
    logos: { name: string; abbr: string }[];
  };
}

export function SocialProofBar({ data }: SocialProofBarProps) {
  const sectionRef = useGsapScrollTrigger();

  return (
    <section ref={sectionRef} className="border-y border-border bg-muted/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          data-gsap="fade"
          className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          {data.title}
        </p>
        <div
          data-gsap="fade-up"
          data-gsap-delay="0.2"
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {data.logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs font-bold text-primary/60">
                {logo.abbr}
              </div>
              <span className="text-sm font-medium">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
