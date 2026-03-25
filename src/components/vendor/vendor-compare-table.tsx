"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
import { Star } from "lucide-react";
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
  contact_wa: string | null;
  vendor_categories: { name: string; icon: string; color: string } | null;
  vendor_packages: Array<{ name: string; price: number; includes: string[] | null }> | null;
}

interface VendorCompareTableProps {
  vendors: CompareVendor[];
}

function findBest(vendors: CompareVendor[], key: "price_deal" | "rating", mode: "min" | "max") {
  const vals = vendors.map((v) => v[key]).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return mode === "min" ? Math.min(...vals) : Math.max(...vals);
}

export function VendorCompareTable({ vendors }: VendorCompareTableProps) {
  const bestPrice = findBest(vendors, "price_deal", "min");
  const bestRating = findBest(vendors, "rating", "max");

  const rows: { label: string; render: (v: CompareVendor) => React.ReactNode }[] = [
    {
      label: "Kategori",
      render: (v) => (
        <span>
          {v.vendor_categories?.icon} {v.vendor_categories?.name ?? "-"}
        </span>
      ),
    },
    {
      label: "Status",
      render: (v) => <StatusBadge {...VENDOR_STATUSES[v.status]} />,
    },
    {
      label: "Harga",
      render: (v) => (
        <span className={`font-number font-medium ${v.price_deal === bestPrice ? "text-green-600" : ""}`}>
          {v.price_deal ? formatRupiah(v.price_deal) : "-"}
        </span>
      ),
    },
    {
      label: "Rating",
      render: (v) => (
        <div className="flex items-center gap-1">
          {v.rating ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < v.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
              <span className={`font-number text-sm ml-1 ${v.rating === bestRating ? "text-green-600 font-medium" : ""}`}>
                {v.rating}
              </span>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Kota",
      render: (v) => v.city ?? "-",
    },
    {
      label: "Kelebihan",
      render: (v) => (
        <p className="text-sm whitespace-pre-line">{v.pros ?? "-"}</p>
      ),
    },
    {
      label: "Kekurangan",
      render: (v) => (
        <p className="text-sm whitespace-pre-line">{v.cons ?? "-"}</p>
      ),
    },
    {
      label: "Paket",
      render: (v) =>
        v.vendor_packages && v.vendor_packages.length > 0 ? (
          <div className="space-y-1">
            {v.vendor_packages.map((pkg, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{pkg.name}</span>
                <span className="font-number text-muted-foreground ml-1">
                  {formatRupiah(pkg.price)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-sm font-medium text-muted-foreground p-3 border-b w-32" />
            {vendors.map((v) => (
              <th key={v.id} className="text-left p-3 border-b min-w-[200px]">
                <div className="space-y-1">
                  <h3 className="font-heading font-semibold">{v.name}</h3>
                  <Link href={`/vendor/${v.id}`}>
                    <Button size="sm" variant="outline">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-b-0">
              <td className="p-3 text-sm font-medium text-muted-foreground align-top">
                {row.label}
              </td>
              {vendors.map((v) => (
                <td key={v.id} className="p-3 align-top">
                  {row.render(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
