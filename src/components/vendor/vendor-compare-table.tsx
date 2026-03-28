"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { formatRupiah, getVendorPriceInfo } from "@/lib/utils/format-currency";
import {
  Star,
  Trophy,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Crown,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Package2,
  StickyNote,
  Info,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

interface CompareVendor {
  id: string;
  name: string;
  status: VendorStatus;
  city: string | null;
  price_deal: number | null;
  rating: number | null;
  pros: string | null;
  cons: string | null;
  contact_phone: string | null;
  contact_wa: string | null;
  email: string | null;
  instagram: string | null;
  website: string | null;
  notes: string | null;
  vendor_categories: { name: string; icon: string; color: string } | null;
  vendor_packages: Array<{
    name: string;
    price: number;
    includes: string[] | null;
  }> | null;
}

interface VendorCompareTableProps {
  vendors: CompareVendor[];
}

type DataRow = {
  type: "data";
  label: string;
  render: (v: CompareVendor) => React.ReactNode;
};
type SectionRow = {
  type: "section";
  title: string;
  icon: React.ReactNode;
};
type Row = DataRow | SectionRow;

function findBest(
  vendors: CompareVendor[],
  key: "price_deal" | "rating",
  mode: "min" | "max"
) {
  const vals = vendors
    .map((v) => v[key])
    .filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return mode === "min" ? Math.min(...vals) : Math.max(...vals);
}

/** Returns packages sorted by price DESC (highest first) */
function getSortedPackages(v: CompareVendor) {
  return [...(v.vendor_packages ?? [])].sort((a, b) => b.price - a.price);
}

function StarRating({ rating, isBest }: { rating: number | null; isBest: boolean }) {
  if (!rating) return <span className="text-muted-foreground text-sm">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/20"
            }`}
          />
        ))}
      </div>
      <span
        className={`font-number text-sm ${
          isBest ? "text-green-600 font-semibold" : "text-muted-foreground"
        }`}
      >
        {rating}/5
      </span>
      {isBest && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
    </div>
  );
}

function RecommendationBanner({ vendors }: { vendors: CompareVendor[] }) {
  const bestPrice = findBest(vendors, "price_deal", "min");
  const bestRating = findBest(vendors, "rating", "max");

  const cheapest = bestPrice
    ? vendors.find((v) => v.price_deal === bestPrice)
    : null;
  const topRated = bestRating
    ? vendors.find((v) => v.rating === bestRating)
    : null;

  const withBoth = vendors.filter(
    (v) => v.price_deal !== null && v.rating !== null
  );
  const bestValue =
    withBoth.length >= 2
      ? withBoth.reduce((best, v) => {
          const maxPrice = Math.max(...withBoth.map((x) => x.price_deal ?? 1));
          const score =
            (v.rating ?? 0) / 5 - (v.price_deal ?? 0) / maxPrice;
          const bestScore =
            (best.rating ?? 0) / 5 - (best.price_deal ?? 0) / maxPrice;
          return score > bestScore ? v : best;
        })
      : null;

  if (!cheapest && !topRated) return null;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="font-heading font-semibold text-sm">Ringkasan Perbandingan</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cheapest && (
          <div className="flex items-start gap-2">
            <TrendingDown className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Harga Terendah</p>
              <p className="text-sm font-medium">{cheapest.name}</p>
              <p className="text-xs font-number text-green-600 whitespace-nowrap">
                {formatRupiah(cheapest.price_deal!)}
              </p>
            </div>
          </div>
        )}
        {topRated && (
          <div className="flex items-start gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Rating Tertinggi</p>
              <p className="text-sm font-medium">{topRated.name}</p>
              <p className="text-xs font-number text-yellow-600">
                {topRated.rating}/5
              </p>
            </div>
          </div>
        )}
        {bestValue &&
          bestValue.id !== cheapest?.id &&
          bestValue.id !== topRated?.id && (
            <div className="flex items-start gap-2">
              <Trophy className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Nilai Terbaik</p>
                <p className="text-sm font-medium">{bestValue.name}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {bestValue.rating}/5 · {formatRupiah(bestValue.price_deal!)}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export function VendorCompareTable({ vendors }: VendorCompareTableProps) {
  const bestPrice = findBest(vendors, "price_deal", "min");
  const bestRating = findBest(vendors, "rating", "max");

  const maxPackages = Math.max(
    0,
    ...vendors.map((v) => (v.vendor_packages ?? []).length)
  );

  /** Generate one row per package rank (sorted high → low) */
  const packageRows: DataRow[] = Array.from({ length: maxPackages }, (_, i) => ({
    type: "data",
    label: i === 0 ? "Paket Utama" : `Paket ke-${i + 1}`,
    render: (v: CompareVendor) => {
      const pkg = getSortedPackages(v)[i];
      if (!pkg) return <span className="text-sm text-muted-foreground">—</span>;
      const isTop = i === 0;
      return (
        <div
          className={`rounded-lg border p-2.5 ${
            isTop ? "border-primary/40 bg-primary/5" : "border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-sm font-semibold leading-tight">{pkg.name}</span>
            <span
              className={`font-number text-sm font-bold whitespace-nowrap shrink-0 ${
                isTop ? "text-primary" : ""
              }`}
            >
              {formatRupiah(pkg.price)}
            </span>
          </div>
          {pkg.includes && pkg.includes.length > 0 && (
            <div className="space-y-0.5">
              {pkg.includes.map((item, j) => (
                <div key={j} className="flex items-start gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  }));

  const rows: Row[] = [
    // ── Section: Informasi ────────────────────────────────────
    {
      type: "section",
      title: "Informasi",
      icon: <Info className="h-3.5 w-3.5" />,
    },
    {
      type: "data",
      label: "Kategori",
      render: (v) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{v.vendor_categories?.icon ?? "📦"}</span>
          <span className="text-sm font-medium">
            {v.vendor_categories?.name ?? "Lainnya"}
          </span>
        </div>
      ),
    },
    {
      type: "data",
      label: "Status",
      render: (v) => <StatusBadge {...VENDOR_STATUSES[v.status]} />,
    },
    {
      type: "data",
      label: "Harga",
      render: (v) => {
        const info = getVendorPriceInfo(v);
        const isCheapest = v.price_deal !== null && v.price_deal === bestPrice;

        if (info.type === "deal") {
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-number font-semibold whitespace-nowrap ${isCheapest ? "text-green-600" : "text-primary"}`}>
                {formatRupiah(info.deal)}
              </span>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-[10px] px-1.5 py-0 shrink-0">
                Deal
              </Badge>
              {isCheapest && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] px-1.5 py-0 shrink-0">
                  Termurah
                </Badge>
              )}
            </div>
          );
        }

        if (info.type === "range") {
          return info.min === info.max ? (
            <span className="font-number text-sm whitespace-nowrap">{formatRupiah(info.min)}</span>
          ) : (
            <div className="space-y-0.5">
              <span className="font-number text-xs text-muted-foreground whitespace-nowrap block">
                {formatRupiah(info.min)} – {formatRupiah(info.max)}
              </span>
              <span className="text-[10px] text-muted-foreground">Range paket</span>
            </div>
          );
        }

        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      type: "data",
      label: "Rating",
      render: (v) => (
        <StarRating
          rating={v.rating}
          isBest={v.rating === bestRating && v.rating !== null}
        />
      ),
    },
    {
      type: "data",
      label: "Lokasi",
      render: (v) =>
        v.city ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm">{v.city}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      type: "data",
      label: "Kontak",
      render: (v) => (
        <div className="flex flex-wrap gap-1.5">
          {v.contact_wa && (
            <a
              href={`https://wa.me/${v.contact_wa.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50"
              >
                <MessageCircle className="h-3 w-3" />
                WA
              </Button>
            </a>
          )}
          {v.contact_phone && (
            <a href={`tel:${v.contact_phone}`}>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Phone className="h-3 w-3" />
                Telp
              </Button>
            </a>
          )}
          {v.instagram && (
            <a
              href={`https://instagram.com/${v.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <ExternalLink className="h-3 w-3" />
                IG
              </Button>
            </a>
          )}
          {!v.contact_wa && !v.contact_phone && !v.instagram && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      ),
    },

    // ── Section: Penilaian ────────────────────────────────────
    {
      type: "section",
      title: "Penilaian",
      icon: <BarChart2 className="h-3.5 w-3.5" />,
    },
    {
      type: "data",
      label: "Kelebihan",
      render: (v) =>
        v.pros ? (
          <div className="space-y-1">
            {v.pros
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{line.replace(/^[-•]\s*/, "")}</span>
                </div>
              ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      type: "data",
      label: "Kekurangan",
      render: (v) =>
        v.cons ? (
          <div className="space-y-1">
            {v.cons
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm">{line.replace(/^[-•]\s*/, "")}</span>
                </div>
              ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },

    // ── Section: Paket (only if any vendor has packages) ─────
    ...(maxPackages > 0
      ? ([
          {
            type: "section",
            title: "Paket (Tertinggi → Terendah)",
            icon: <Package2 className="h-3.5 w-3.5" />,
          },
          ...packageRows,
        ] as Row[])
      : []),

    // ── Section: Catatan ──────────────────────────────────────
    {
      type: "section",
      title: "Catatan",
      icon: <StickyNote className="h-3.5 w-3.5" />,
    },
    {
      type: "data",
      label: "Catatan",
      render: (v) =>
        v.notes ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {v.notes}
          </p>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <RecommendationBanner vendors={vendors} />

      <div className="rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* ── Vendor header row ── */}
            <thead>
              <tr className="border-b bg-muted/30">
                {/* Empty label cell */}
                <th className="sticky left-0 z-10 bg-muted/30 w-[88px] min-w-[88px] p-3" />
                {vendors.map((v) => {
                  const isBestPrice =
                    v.price_deal !== null && v.price_deal === bestPrice;
                  const isBestRating =
                    v.rating !== null && v.rating === bestRating;
                  const highlight = isBestPrice || isBestRating;
                  return (
                    <th
                      key={v.id}
                      className={`text-left p-4 min-w-[170px] border-l align-top ${
                        highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Name + category */}
                        <div className="flex items-start gap-2">
                          <span className="text-xl shrink-0 mt-0.5">
                            {v.vendor_categories?.icon ?? "📦"}
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-heading font-semibold text-sm leading-tight break-words">
                              {v.name}
                            </h3>
                            {v.city && (
                              <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {v.city}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status + price pill row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <StatusBadge {...VENDOR_STATUSES[v.status]} />
                          {(() => {
                            const info = getVendorPriceInfo(v);
                            if (info.type === "deal") return (
                              <span className={`text-xs font-number font-semibold whitespace-nowrap ${isBestPrice ? "text-green-600" : "text-primary"}`}>
                                {formatRupiah(info.deal)}
                              </span>
                            );
                            if (info.type === "range") return (
                              <span className="text-[10px] font-number text-muted-foreground whitespace-nowrap">
                                {info.min === info.max ? formatRupiah(info.min) : `${formatRupiah(info.min)}–${formatRupiah(info.max)}`}
                              </span>
                            );
                            return null;
                          })()}
                          {v.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {v.rating}/5
                            </span>
                          )}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          <Link href={`/vendor/${v.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              Detail
                            </Button>
                          </Link>
                          {v.contact_wa && (
                            <a
                              href={`https://wa.me/${v.contact_wa.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <MessageCircle className="h-3 w-3" />
                                WA
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Comparison rows ── */}
            <tbody>
              {rows.map((row, i) => {
                if (row.type === "section") {
                  return (
                    <tr key={`section-${i}`}>
                      <td
                        colSpan={vendors.length + 1}
                        className="px-4 py-2 bg-muted/40 border-b"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {row.icon}
                          {row.title}
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={`${row.label}-${i}`}
                    className="border-b last:border-b-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="sticky left-0 z-10 bg-background p-3 text-xs font-medium text-muted-foreground align-top leading-relaxed">
                      {row.label}
                    </td>
                    {vendors.map((v) => (
                      <td key={v.id} className="p-3 align-top border-l">
                        {row.render(v)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
