export type PurchaseStatus = "belum_dibeli" | "sudah_dibeli" | "sudah_diterima";

export const PURCHASE_STATUSES: Record<
  PurchaseStatus,
  { label: string; color: string; bgColor: string }
> = {
  belum_dibeli: { label: "Belum Dibeli", color: "#6B8DAE", bgColor: "#6B8DAE15" },
  sudah_dibeli: { label: "Sudah Dibeli", color: "#81B29A", bgColor: "#81B29A15" },
  sudah_diterima: { label: "Sudah Diterima", color: "#8B6F4E", bgColor: "#8B6F4E15" },
};

export type SeserahanPriority = "tinggi" | "sedang" | "rendah";

export const PRIORITIES: Record<
  SeserahanPriority,
  { label: string; color: string; bgColor: string }
> = {
  tinggi: { label: "Tinggi", color: "#C75C5C", bgColor: "#C75C5C15" },
  sedang: { label: "Sedang", color: "#D4A574", bgColor: "#D4A57415" },
  rendah: { label: "Rendah", color: "#6B8DAE", bgColor: "#6B8DAE15" },
};

export type SeserahanCategory = "mahar" | "seserahan";

export const SESERAHAN_CATEGORIES: Record<SeserahanCategory, string> = {
  mahar: "Mahar",
  seserahan: "Seserahan",
};
