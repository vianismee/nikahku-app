"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGsapScrollTrigger } from "@/lib/hooks/use-gsap";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    socialProof: { text: string; count: string; suffix: string };
    stats: { value: string; label: string }[];
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  const sectionRef = useGsapScrollTrigger();
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax on blobs
    if (blob1Ref.current) {
      gsap.to(blob1Ref.current, {
        y: -80,
        scrollTrigger: {
          trigger: blob1Ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
    if (blob2Ref.current) {
      gsap.to(blob2Ref.current, {
        y: -50,
        x: 30,
        scrollTrigger: {
          trigger: blob2Ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    // Animated gradient rotation
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32"
    >
      {/* Background decoration with parallax */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={gradientRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, oklch(0.52 0.06 60 / 0.08), transparent, oklch(0.73 0.08 55 / 0.06), transparent)",
          }}
        />
        <div
          ref={blob1Ref}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/5 blur-3xl"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            data-gsap="fade-down"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {data.badge}
          </div>

          {/* Headline */}
          <h1
            data-gsap="fade-up"
            data-gsap-delay="0.1"
            className="font-[family-name:var(--font-instrument-serif)] text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-7xl xl:text-8xl"
          >
            Rencanakan{" "}
            <span className="italic text-primary">
              Pernikahan <br /> Impianmu
            </span>{" "}
            Tanpa Ribet
          </h1>

          {/* Subheadline */}
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {data.subheadline}
          </p>

          {/* CTAs */}
          <div
            data-gsap="fade-up"
            data-gsap-delay="0.3"
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href={data.primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 px-8 text-base",
              )}
            >
              {data.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={data.secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 px-8 text-base",
              )}
            >
              {data.secondaryCta.label}
            </a>
          </div>

          {/* Social proof */}
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.4"
            className="mt-8 text-sm text-muted-foreground"
          >
            {data.socialProof.text}{" "}
            <span className="font-semibold text-foreground">
              {data.socialProof.count}
            </span>{" "}
            {data.socialProof.suffix}
          </p>
        </div>

        {/* Stats */}
        <div
          data-gsap="fade-up"
          data-gsap-delay="0.5"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8"
        >
          {data.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
