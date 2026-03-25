export type RsvpStatus =
  | "belum_diundang"
  | "undangan_terkirim"
  | "hadir"
  | "tidak_hadir"
  | "belum_konfirmasi";

export const RSVP_STATUSES: Record<
  RsvpStatus,
  { label: string; color: string; bgColor: string }
> = {
  belum_diundang: { label: "Belum Diundang", color: "#9C8E7E", bgColor: "#9C8E7E15" },
  undangan_terkirim: { label: "Undangan Terkirim", color: "#6B8DAE", bgColor: "#6B8DAE15" },
  hadir: { label: "Hadir", color: "#5B8C5A", bgColor: "#5B8C5A15" },
  tidak_hadir: { label: "Tidak Hadir", color: "#C75C5C", bgColor: "#C75C5C15" },
  belum_konfirmasi: { label: "Belum Konfirmasi", color: "#F2CC8F", bgColor: "#F2CC8F15" },
};
