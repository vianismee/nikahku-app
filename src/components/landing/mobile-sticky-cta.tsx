"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface MobileStickyCtaProps {
  data: {
    label: string;
    href: string;
  };
}

export function MobileStickyCta({ data }: MobileStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm p-3 transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Link
        href={data.href}
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full gap-2 text-base"
        )}
      >
        {data.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
