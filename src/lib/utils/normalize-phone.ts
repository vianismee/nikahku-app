/**
 * Normalize Indonesian phone number to international format (+62...)
 * Used for WhatsApp direct links (wa.me/628xxx)
 *
 * @example
 * normalizePhone("085159446361")  => "+6285159446361"
 * normalizePhone("6285159446361") => "+6285159446361"
 * normalizePhone("+6285159446361") => "+6285159446361"
 */
export function normalizePhone(raw: string): string {
  // Remove spaces, dashes, parentheses
  const cleaned = raw.trim().replace(/[\s\-()]/g, "");
  if (!cleaned) return "";

  // Already in +62 format
  if (cleaned.startsWith("+62")) return cleaned;

  // Starts with 62 (missing the +)
  if (cleaned.startsWith("62")) return `+${cleaned}`;

  // Starts with 0 — replace with +62 (Indonesian local format)
  if (cleaned.startsWith("0")) return `+62${cleaned.slice(1)}`;

  // Otherwise return as-is
  return cleaned;
}
