"use client";

import Link from "next/link";

interface FooterProps {
  data: {
    brand: string;
    tagline: string;
    links: {
      group: string;
      items: { label: string; href: string }[];
    }[];
    copyright: string;
  };
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-xl font-bold text-primary"
            >
              {data.brand}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {data.tagline}
            </p>
          </div>

          {/* Link groups */}
          {data.links.map((group) => (
            <div key={group.group}>
              <h4 className="text-sm font-semibold text-foreground">
                {group.group}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("#") ||
                    item.href.startsWith("http") ||
                    item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            {data.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
