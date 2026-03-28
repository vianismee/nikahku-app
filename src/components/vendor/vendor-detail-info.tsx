"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Mail,
  AtSign,
  Globe,
  MapPin,
  Star,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from "lucide-react";

interface VendorDetailInfoProps {
  vendor: {
    contact_phone: string | null;
    contact_wa: string | null;
    email: string | null;
    instagram: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    rating: number | null;
    pros: string | null;
    cons: string | null;
    notes: string | null;
  };
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
      {value}
    </a>
  ) : (
    <span className="break-words">{value}</span>
  );

  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        {content}
      </div>
    </div>
  );
}

export function VendorDetailInfo({ vendor }: VendorDetailInfoProps) {
  const contactItems = [
    vendor.contact_phone && {
      icon: Phone,
      label: "Telepon",
      value: vendor.contact_phone,
      href: `tel:${vendor.contact_phone}`,
    },
    vendor.contact_wa && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: vendor.contact_wa,
      href: `https://wa.me/${vendor.contact_wa.replace(/\D/g, "")}`,
    },
    vendor.email && {
      icon: Mail,
      label: "Email",
      value: vendor.email,
      href: `mailto:${vendor.email}`,
    },
    vendor.instagram && {
      icon: AtSign,
      label: "Instagram",
      value: vendor.instagram,
      href: `https://instagram.com/${vendor.instagram.replace("@", "")}`,
    },
    vendor.website && {
      icon: Globe,
      label: "Website",
      value: vendor.website,
      href: vendor.website,
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string }[];

  const hasLocation = vendor.city || vendor.address;
  const hasRating = vendor.rating || vendor.pros || vendor.cons || vendor.notes;

  // Nothing to show at all
  if (!contactItems.length && !hasLocation && !hasRating) return null;

  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {/* Kontak */}
        {contactItems.length > 0 && (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kontak</p>
            {contactItems.map((item) => (
              <InfoRow key={item.label} {...item} />
            ))}
          </div>
        )}

        {/* Lokasi */}
        {hasLocation && (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lokasi</p>
            {vendor.city && <InfoRow icon={MapPin} label="Kota" value={vendor.city} />}
            {vendor.address && <InfoRow icon={MapPin} label="Alamat" value={vendor.address} />}
          </div>
        )}

        {/* Penilaian */}
        {hasRating && (
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Penilaian</p>
            {vendor.rating && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < vendor.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                  />
                ))}
                <span className="text-sm font-number ml-1">{vendor.rating}/5</span>
              </div>
            )}
            {vendor.pros && (
              <div className="flex items-start gap-3 text-sm">
                <ThumbsUp className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Kelebihan</p>
                  <p className="whitespace-pre-line">{vendor.pros}</p>
                </div>
              </div>
            )}
            {vendor.cons && (
              <div className="flex items-start gap-3 text-sm">
                <ThumbsDown className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Kekurangan</p>
                  <p className="whitespace-pre-line">{vendor.cons}</p>
                </div>
              </div>
            )}
            {vendor.notes && (
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Catatan</p>
                  <p className="whitespace-pre-line">{vendor.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
