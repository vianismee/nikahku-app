export type VendorStatus =
  | "shortlisted"
  | "contacted"
  | "negotiating"
  | "booked"
  | "paid_dp"
  | "paid_full"
  | "completed"
  | "cancelled";

export const VENDOR_STATUSES: Record<
  VendorStatus,
  { label: string; color: string; bgColor: string }
> = {
  shortlisted: { label: "Shortlisted", color: "#6B8DAE", bgColor: "#6B8DAE15" },
  contacted: { label: "Dihubungi", color: "#8B6F4E", bgColor: "#8B6F4E15" },
  negotiating: { label: "Negosiasi", color: "#F2CC8F", bgColor: "#F2CC8F15" },
  booked: { label: "Booked", color: "#81B29A", bgColor: "#81B29A15" },
  paid_dp: { label: "DP Dibayar", color: "#D4A574", bgColor: "#D4A57415" },
  paid_full: { label: "Lunas", color: "#5B8C5A", bgColor: "#5B8C5A15" },
  completed: { label: "Selesai", color: "#3D405B", bgColor: "#3D405B15" },
  cancelled: { label: "Dibatalkan", color: "#C75C5C", bgColor: "#C75C5C15" },
};

/** Ordered pipeline for status flow */
export const VENDOR_STATUS_PIPELINE: VendorStatus[] = [
  "shortlisted",
  "contacted",
  "negotiating",
  "booked",
  "paid_dp",
  "paid_full",
  "completed",
];
