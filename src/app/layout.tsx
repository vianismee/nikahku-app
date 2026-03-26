import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import "@/components/ui/overrides.css";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NIKAHKU — Rencanakan Pernikahan Impianmu",
    template: "%s | NIKAHKU",
  },
  description:
    "Platform perencanaan pernikahan lengkap — kelola budget, vendor, tamu undangan, seserahan, dan checklist pernikahan dalam satu tempat.",
  applicationName: "NIKAHKU",
  keywords: [
    "wedding planner",
    "pernikahan",
    "wedding planning",
    "budget pernikahan",
    "vendor pernikahan",
    "nikahku",
    "wedding app indonesia",
  ],
  authors: [{ name: "NIKAHKU" }],
  creator: "NIKAHKU",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "NIKAHKU",
    title: "NIKAHKU — Rencanakan Pernikahan Impianmu Tanpa Ribet",
    description:
      "Kelola budget, vendor, tamu undangan, seserahan, dan checklist pernikahan — semua dalam satu platform yang mudah dan elegan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIKAHKU — Wedding Planner Indonesia",
    description:
      "Platform perencanaan pernikahan lengkap untuk pasangan Indonesia.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NIKAHKU",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B6F4E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <ToastProvider />
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
