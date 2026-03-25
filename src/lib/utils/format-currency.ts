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
