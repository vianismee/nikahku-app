"use client";

import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";

interface HowItWorksSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
}

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const stepsRef = useGsapStagger();

  return (
    <section id="cara-kerja" className="relative py-20 sm:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            3 Langkah Menuju{" "}
            <span className="italic text-primary">Pernikahan Impian</span>
          </h2>
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            {data.subheadline}
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3"
        >
          {data.steps.map((step, i) => (
            <div
              key={step.number}
              data-gsap-stagger
              className="relative text-center"
            >
              {/* Connector line */}
              {i < data.steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border md:block" />
              )}

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/5">
                <span className="font-heading text-xl font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
