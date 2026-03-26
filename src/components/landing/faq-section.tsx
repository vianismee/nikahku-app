"use client";

import { useGsapScrollTrigger, useGsapStagger } from "@/lib/hooks/use-gsap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionProps {
  data: {
    badge: string;
    headline: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
}

export function FaqSection({ data }: FaqSectionProps) {
  const headerRef = useGsapScrollTrigger();
  const listRef = useGsapStagger();

  return (
    <section id="faq" className="relative py-20 sm:py-28">
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
            {data.headline}
          </h2>
        </div>

        {/* Accordion */}
        <div ref={listRef} className="mx-auto mt-12 max-w-2xl">
          <Accordion className="w-full">
            {data.items.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} data-gsap-stagger>
                <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
