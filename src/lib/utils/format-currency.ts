/**
 * Format number to Indonesian Rupiah string
 * @example formatRupiah(50000000) => "Rp 50.000.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousand separators only (no "Rp" prefix)
 * @example formatNumber(50000000) => "50.000.000"
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

/**
 * Parse formatted Rupiah string back to number
 * @example parseCurrency("50.000.000") => 50000000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
}

/**
 * Format input value with thousand separators as user types
 * @example formatInputRupiah("50000000") => "50.000.000"
 */
export function formatInputRupiah(value: string): string {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Get vendor price display info based on deal price or package price range.
 * - If price_deal exists  → { type: "deal",  deal: number }
 * - If packages exist     → { type: "range", min: number, max: number }
 * - Otherwise             → { type: "none" }
 */
export type VendorPriceInfo =
  | { type: "deal"; deal: number }
  | { type: "range"; min: number; max: number }
  | { type: "none" };

export function getVendorPriceInfo(vendor: {
  price_deal?: number | null;
  vendor_packages?: Array<{ price: number }> | null;
}): VendorPriceInfo {
  if (vendor.price_deal) {
    return { type: "deal", deal: vendor.price_deal };
  }
  const prices = (vendor.vendor_packages ?? [])
    .map((p) => p.price)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  if (prices.length > 0) {
    return { type: "range", min: prices[0], max: prices[prices.length - 1] };
  }
  return { type: "none" };
}
