export type ShopPlatform = "shopee" | "tokopedia" | "other" | null;

/**
 * Auto-detect e-commerce platform from URL
 */
export function detectPlatform(url: string | null | undefined): ShopPlatform {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes("shopee.co.id") || lower.includes("shopee.com")) return "shopee";
  if (lower.includes("tokopedia.com")) return "tokopedia";
  if (lower.startsWith("http")) return "other";
  return null;
}

/**
 * Get platform display name
 */
export function getPlatformName(platform: ShopPlatform): string {
  switch (platform) {
    case "shopee": return "Shopee";
    case "tokopedia": return "Tokopedia";
    case "other": return "Toko Online";
    default: return "";
  }
}
