"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
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

function StarRating({ rating, isBest }: { rating: number | null; isBest: boolean }) {
  if (!rating) return <span className="text-muted-foreground text-sm">-</span>;
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

  // Best value: highest rating with reasonable price
  const withBoth = vendors.filter(
    (v) => v.price_deal !== null && v.rating !== null
  );
  const bestValue =
    withBoth.length >= 2
      ? withBoth.reduce((best, v) => {
          const score =
            (v.rating ?? 0) / 5 -
            (v.price_deal ?? 0) /
              Math.max(...withBoth.map((x) => x.price_deal ?? 1));
          const bestScore =
            (best.rating ?? 0) / 5 -
            (best.price_deal ?? 0) /
              Math.max(...withBoth.map((x) => x.price_deal ?? 1));
          return score > bestScore ? v : best;
        })
      : null;

  if (!cheapest && !topRated) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-semibold text-sm">Ringkasan Perbandingan</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cheapest && (
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Harga Terendah</p>
                <p className="text-sm font-medium">{cheapest.name}</p>
                <p className="text-xs font-number text-green-600">
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
          {bestValue && bestValue.id !== cheapest?.id && bestValue.id !== topRated?.id && (
            <div className="flex items-start gap-2">
              <Trophy className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Nilai Terbaik</p>
                <p className="text-sm font-medium">{bestValue.name}</p>
                <p className="text-xs text-muted-foreground">
                  Rating {bestValue.rating}/5 &middot;{" "}
                  {formatRupiah(bestValue.price_deal!)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function VendorCompareTable({ vendors }: VendorCompareTableProps) {
  const bestPrice = findBest(vendors, "price_deal", "min");
  const bestRating = findBest(vendors, "rating", "max");

  const rows: {
    label: string;
    render: (v: CompareVendor) => React.ReactNode;
  }[] = [
    {
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
      label: "Status",
      render: (v) => <StatusBadge {...VENDOR_STATUSES[v.status]} />,
    },
    {
      label: "Harga",
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`font-number font-semibold ${
              v.price_deal === bestPrice && v.price_deal !== null
                ? "text-green-600"
                : ""
            }`}
          >
            {v.price_deal ? formatRupiah(v.price_deal) : "-"}
          </span>
          {v.price_deal === bestPrice && v.price_deal !== null && (
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] px-1.5 py-0">
              Termurah
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      render: (v) => (
        <StarRating rating={v.rating} isBest={v.rating === bestRating && v.rating !== null} />
      ),
    },
    {
      label: "Lokasi",
      render: (v) =>
        v.city ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm">{v.city}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
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
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50">
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
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      label: "Kelebihan",
      render: (v) =>
        v.pros ? (
          <div className="space-y-1">
            {v.pros.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm">{line.replace(/^[-•]\s*/, "")}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      label: "Kekurangan",
      render: (v) =>
        v.cons ? (
          <div className="space-y-1">
            {v.cons.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                <span className="text-sm">{line.replace(/^[-•]\s*/, "")}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      label: "Paket",
      render: (v) =>
        v.vendor_packages && v.vendor_packages.length > 0 ? (
          <div className="space-y-2">
            {v.vendor_packages.map((pkg, i) => (
              <div key={i} className="rounded-lg border border-border p-2.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium line-clamp-1">{pkg.name}</span>
                  <span className="font-number text-xs font-semibold text-primary whitespace-nowrap">
                    {formatRupiah(pkg.price)}
                  </span>
                </div>
                {pkg.includes && pkg.includes.length > 0 && (
                  <div className="space-y-0.5">
                    {pkg.includes.slice(0, 4).map((item, j) => (
                      <div key={j} className="flex items-start gap-1">
                        <CheckCircle2 className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{item}</span>
                      </div>
                    ))}
                    {pkg.includes.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{pkg.includes.length - 4} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Belum ada paket</span>
        ),
    },
    {
      label: "Catatan",
      render: (v) =>
        v.notes ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
            {v.notes}
          </p>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <RecommendationBanner vendors={vendors} />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="sticky left-0 z-10 bg-background text-left text-sm font-medium text-muted-foreground p-4 w-28 min-w-28" />
                  {vendors.map((v) => {
                    const isBestPrice =
                      v.price_deal !== null && v.price_deal === bestPrice;
                    const isBestRating =
                      v.rating !== null && v.rating === bestRating;
                    return (
                      <th
                        key={v.id}
                        className={`text-left p-4 min-w-[220px] border-l ${
                          isBestPrice || isBestRating ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {v.vendor_categories?.icon ?? "📦"}
                            </span>
                            <div>
                              <h3 className="font-heading font-semibold text-base">
                                {v.name}
                              </h3>
                              {v.city && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {v.city}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <Link href={`/vendor/${v.id}`}>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                Lihat Detail
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
                                  WhatsApp
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
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b last:border-b-0 ${
                      i % 2 === 0 ? "" : "bg-muted/30"
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit p-4 text-sm font-medium text-muted-foreground align-top whitespace-nowrap">
                      {row.label}
                    </td>
                    {vendors.map((v) => (
                      <td key={v.id} className="p-4 align-top border-l">
                        {row.render(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
