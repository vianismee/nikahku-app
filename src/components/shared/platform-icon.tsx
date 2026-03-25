"use client";

import { ExternalLink, ShoppingBag } from "lucide-react";
import { detectPlatform, getPlatformName } from "@/lib/utils/platform-detect";

interface PlatformIconProps {
  url: string | null | undefined;
  showLabel?: boolean;
  className?: string;
}

export function PlatformIcon({ url, showLabel = false, className }: PlatformIconProps) {
  const platform = detectPlatform(url);

  if (!platform || !url) return null;

  const name = getPlatformName(platform);
  const colors: Record<string, string> = {
    shopee: "text-orange-500",
    tokopedia: "text-green-600",
    other: "text-muted-foreground",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm hover:underline ${colors[platform]} ${className ?? ""}`}
    >
      {platform === "shopee" || platform === "tokopedia" ? (
        <ShoppingBag className="h-3.5 w-3.5" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5" />
      )}
      {showLabel && <span>{name}</span>}
    </a>
  );
}
