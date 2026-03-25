import { differenceInDays, format, formatDistanceToNow, isPast, isToday } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Calculate days until wedding
 * @returns positive = days remaining, negative = days passed, 0 = today
 */
export function daysUntilWedding(weddingDate: string | Date): number {
  const target = typeof weddingDate === "string" ? new Date(weddingDate) : weddingDate;
  return differenceInDays(target, new Date());
}

/**
 * Format date to Indonesian locale
 * @example formatDateID("2026-06-15") => "15 Juni 2026"
 */
export function formatDateID(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: id });
}

/**
 * Format date short
 * @example formatDateShort("2026-06-15") => "15 Jun 2026"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM yyyy", { locale: id });
}

/**
 * Relative time string
 * @example relativeTime("2026-06-15") => "dalam 3 bulan"
 */
export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: string | Date): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return isPast(d) && !isToday(d);
}
