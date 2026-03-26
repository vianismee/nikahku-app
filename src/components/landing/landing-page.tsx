"use client";

import { LangProvider, useLang } from "./language-provider";
import { Navbar } from "./navbar";
import { HeroSection } from "./hero-section";
import { DashboardPreview } from "./dashboard-preview";
import { SocialProofBar } from "./social-proof-bar";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PricingSection } from "./pricing-section";
import { TestimonialsSection } from "./testimonials-section";
import { FaqSection } from "./faq-section";
import { ContactSection } from "./contact-section";
import { FinalCtaSection } from "./final-cta-section";
import { MobileStickyCta } from "./mobile-sticky-cta";
import { PwaInstallBanner } from "./pwa-install-banner";
import { Footer } from "./footer";

function LandingContent() {
  const { data } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Navbar data={data.navbar} />
      <main>
        <HeroSection data={data.hero} />
        <DashboardPreview />
        <SocialProofBar data={data.socialProofBar} />
        <FeaturesSection data={data.features} />
        <HowItWorksSection data={data.howItWorks} />
        <PricingSection data={data.pricing} />
        <TestimonialsSection data={data.testimonials} />
        <FaqSection data={data.faq} />
        <ContactSection data={data.contact} />
        <FinalCtaSection data={data.finalCta} />
      </main>
      <Footer data={data.footer} />
      <MobileStickyCta data={data.hero.primaryCta} />
      <PwaInstallBanner data={data.pwaInstall} />
    </div>
  );
}

export function LandingPage() {
  return (
    <LangProvider>
      <LandingContent />
    </LangProvider>
  );
}
