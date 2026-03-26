"use client";

import { Mail, MessageCircle, AtSign } from "lucide-react";
import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";

interface ContactSectionProps {
  data: {
    badge: string;
    headline: string;
    subheadline: string;
    channels: {
      icon: string;
      label: string;
      value: string;
      href: string;
    }[];
  };
}

const iconMap: Record<string, React.ElementType> = {
  Mail,
  MessageCircle,
  Instagram: AtSign,
  AtSign,
};

export function ContactSection({ data }: ContactSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const gridRef = useGsapStagger();

  return (
    <section id="kontak" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div
          ref={gridRef}
          className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3"
        >
          {data.channels.map((channel) => {
            const Icon = iconMap[channel.icon] || Mail;
            return (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                data-gsap-stagger
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="inline-flex rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {channel.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
