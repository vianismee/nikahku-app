/**
 * Wedding planning task templates for Indonesian weddings.
 * Each task has: title, category, priority, relative due (months before wedding).
 * Due dates are calculated from wedding_date at runtime.
 */

export interface TemplateTask {
  title: string;
  category: string;
  priority: "urgent" | "high" | "medium" | "low";
  /** Months before wedding date. 0 = wedding day, negative = after wedding */
  monthsBefore: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  tasks: TemplateTask[];
}

// ─── SIMPLE (Pernikahan Sederhana / Intimate) ────────────────────────────────

const SIMPLE_TASKS: TemplateTask[] = [
  // 12 bulan sebelum
  { title: "Tentukan tanggal pernikahan", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Tentukan budget total", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Buat daftar tamu undangan", category: "undangan", priority: "high", monthsBefore: 12 },

  // 9 bulan sebelum
  { title: "Cari dan booking venue akad", category: "venue", priority: "urgent", monthsBefore: 9 },
  { title: "Cari dan booking katering", category: "catering", priority: "high", monthsBefore: 9 },
  { title: "Cari fotografer & videografer", category: "fotografi", priority: "high", monthsBefore: 9 },
  { title: "Pilih konsep dekorasi", category: "dekorasi", priority: "medium", monthsBefore: 9 },

  // 6 bulan sebelum
  { title: "Booking fotografer & videografer", category: "fotografi", priority: "high", monthsBefore: 6 },
  { title: "Booking dekorasi venue", category: "dekorasi", priority: "high", monthsBefore: 6 },
  { title: "Pilih dan pesan baju pengantin", category: "busana", priority: "high", monthsBefore: 6 },
  { title: "Pesan cincin pernikahan", category: "busana", priority: "high", monthsBefore: 6 },
  { title: "Siapkan mahar", category: "lainnya", priority: "medium", monthsBefore: 6 },
  { title: "Urus surat-surat nikah (KUA/Catatan Sipil)", category: "lainnya", priority: "urgent", monthsBefore: 6 },

  // 3 bulan sebelum
  { title: "Finalisasi daftar tamu", category: "undangan", priority: "high", monthsBefore: 3 },
  { title: "Desain dan cetak undangan", category: "undangan", priority: "high", monthsBefore: 3 },
  { title: "Fitting baju pengantin pertama", category: "busana", priority: "medium", monthsBefore: 3 },
  { title: "Pilih menu katering", category: "catering", priority: "medium", monthsBefore: 3 },
  { title: "Siapkan seserahan", category: "lainnya", priority: "medium", monthsBefore: 3 },
  { title: "Booking MUA (Make-Up Artist)", category: "busana", priority: "high", monthsBefore: 3 },

  // 1 bulan sebelum
  { title: "Sebar undangan", category: "undangan", priority: "urgent", monthsBefore: 1 },
  { title: "Konfirmasi semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 1 },
  { title: "Fitting baju pengantin final", category: "busana", priority: "high", monthsBefore: 1 },
  { title: "Trial make-up", category: "busana", priority: "medium", monthsBefore: 1 },
  { title: "Bayar pelunasan vendor", category: "lainnya", priority: "urgent", monthsBefore: 1 },
  { title: "Siapkan rundown acara", category: "lainnya", priority: "high", monthsBefore: 1 },

  // 1 minggu sebelum
  { title: "Technical meeting dengan semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 0.25 },
  { title: "Cek kelengkapan dekorasi", category: "dekorasi", priority: "high", monthsBefore: 0.25 },
  { title: "Konfirmasi jumlah tamu hadir", category: "undangan", priority: "high", monthsBefore: 0.25 },
  { title: "Persiapkan tips/amplop untuk vendor", category: "lainnya", priority: "medium", monthsBefore: 0.25 },
  { title: "Siapkan pakaian & aksesoris hari H", category: "busana", priority: "high", monthsBefore: 0.25 },

  // Hari H
  { title: "Gladi resik / rehearsal", category: "lainnya", priority: "urgent", monthsBefore: 0.03 },
  { title: "Pernikahan hari H!", category: "lainnya", priority: "urgent", monthsBefore: 0 },
];

// ─── STANDARD (Pernikahan Standard / Resepsi Lengkap) ────────────────────────

const STANDARD_TASKS: TemplateTask[] = [
  // 12 bulan sebelum
  { title: "Tentukan tanggal pernikahan", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Tentukan budget total", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Buat daftar tamu undangan awal", category: "undangan", priority: "high", monthsBefore: 12 },
  { title: "Riset dan survei venue", category: "venue", priority: "high", monthsBefore: 12 },
  { title: "Tentukan tema/konsep pernikahan", category: "dekorasi", priority: "medium", monthsBefore: 12 },

  // 10 bulan sebelum
  { title: "Booking venue akad nikah", category: "venue", priority: "urgent", monthsBefore: 10 },
  { title: "Booking venue resepsi", category: "venue", priority: "urgent", monthsBefore: 10 },
  { title: "Cari katering dan tasting", category: "catering", priority: "high", monthsBefore: 10 },
  { title: "Cari fotografer & videografer", category: "fotografi", priority: "high", monthsBefore: 10 },
  { title: "Cari wedding organizer (opsional)", category: "lainnya", priority: "medium", monthsBefore: 10 },

  // 8 bulan sebelum
  { title: "Booking katering", category: "catering", priority: "urgent", monthsBefore: 8 },
  { title: "Booking fotografer & videografer", category: "fotografi", priority: "high", monthsBefore: 8 },
  { title: "Booking dekorasi", category: "dekorasi", priority: "high", monthsBefore: 8 },
  { title: "Cari MUA (Make-Up Artist)", category: "busana", priority: "high", monthsBefore: 8 },
  { title: "Pilih dan pesan baju pengantin", category: "busana", priority: "high", monthsBefore: 8 },
  { title: "Pesan cincin pernikahan", category: "busana", priority: "high", monthsBefore: 8 },

  // 6 bulan sebelum
  { title: "Booking MUA", category: "busana", priority: "high", monthsBefore: 6 },
  { title: "Urus surat-surat nikah (KUA/Catatan Sipil)", category: "lainnya", priority: "urgent", monthsBefore: 6 },
  { title: "Siapkan mahar", category: "lainnya", priority: "medium", monthsBefore: 6 },
  { title: "Cari entertainment/band/DJ", category: "lainnya", priority: "medium", monthsBefore: 6 },
  { title: "Booking MC acara", category: "lainnya", priority: "medium", monthsBefore: 6 },
  { title: "Pilih kue pengantin", category: "catering", priority: "low", monthsBefore: 6 },
  { title: "Pilih souvenir/hampers tamu", category: "lainnya", priority: "low", monthsBefore: 6 },

  // 4 bulan sebelum
  { title: "Finalisasi daftar tamu", category: "undangan", priority: "high", monthsBefore: 4 },
  { title: "Desain undangan (cetak & digital)", category: "undangan", priority: "high", monthsBefore: 4 },
  { title: "Fitting baju pengantin pertama", category: "busana", priority: "medium", monthsBefore: 4 },
  { title: "Pilih menu katering final", category: "catering", priority: "medium", monthsBefore: 4 },
  { title: "Beli seserahan", category: "lainnya", priority: "medium", monthsBefore: 4 },
  { title: "Booking hotel untuk tamu luar kota", category: "lainnya", priority: "low", monthsBefore: 4 },
  { title: "Cari transport pengantin (mobil hias)", category: "lainnya", priority: "low", monthsBefore: 4 },

  // 2 bulan sebelum
  { title: "Cetak dan kirim undangan", category: "undangan", priority: "urgent", monthsBefore: 2 },
  { title: "Kirim undangan digital", category: "undangan", priority: "high", monthsBefore: 2 },
  { title: "Fitting baju pengantin kedua", category: "busana", priority: "medium", monthsBefore: 2 },
  { title: "Trial make-up dan rambut", category: "busana", priority: "high", monthsBefore: 2 },
  { title: "Pesan kue pengantin", category: "catering", priority: "medium", monthsBefore: 2 },
  { title: "Susun rundown acara detail", category: "lainnya", priority: "high", monthsBefore: 2 },
  { title: "Pesan souvenir/hampers", category: "lainnya", priority: "medium", monthsBefore: 2 },

  // 1 bulan sebelum
  { title: "Konfirmasi semua vendor & bayar pelunasan", category: "lainnya", priority: "urgent", monthsBefore: 1 },
  { title: "Fitting baju pengantin final", category: "busana", priority: "high", monthsBefore: 1 },
  { title: "Follow up RSVP tamu undangan", category: "undangan", priority: "high", monthsBefore: 1 },
  { title: "Siapkan souvenir dan goodie bag", category: "lainnya", priority: "medium", monthsBefore: 1 },
  { title: "Buat denah meja tamu", category: "undangan", priority: "medium", monthsBefore: 1 },
  { title: "Siapkan angpao/tip untuk vendor", category: "lainnya", priority: "low", monthsBefore: 1 },
  { title: "Cek kesiapan transport pengantin", category: "lainnya", priority: "medium", monthsBefore: 1 },

  // 2 minggu sebelum
  { title: "Technical meeting dengan semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 0.5 },
  { title: "Konfirmasi final jumlah tamu hadir", category: "undangan", priority: "urgent", monthsBefore: 0.5 },
  { title: "Cek kelengkapan dekorasi", category: "dekorasi", priority: "high", monthsBefore: 0.5 },
  { title: "Briefing keluarga & MC", category: "lainnya", priority: "high", monthsBefore: 0.5 },

  // 1 minggu sebelum
  { title: "Siapkan pakaian & aksesoris hari H", category: "busana", priority: "high", monthsBefore: 0.25 },
  { title: "Cek kesiapan venue", category: "venue", priority: "high", monthsBefore: 0.25 },
  { title: "Siapkan kotak angpao & buku tamu", category: "lainnya", priority: "medium", monthsBefore: 0.25 },

  // Hari H
  { title: "Gladi resik / rehearsal", category: "lainnya", priority: "urgent", monthsBefore: 0.03 },
  { title: "Setup dekorasi venue", category: "dekorasi", priority: "urgent", monthsBefore: 0.03 },
  { title: "Akad nikah", category: "lainnya", priority: "urgent", monthsBefore: 0 },
  { title: "Resepsi pernikahan", category: "lainnya", priority: "urgent", monthsBefore: 0 },
];

// ─── GRAND (Pernikahan Besar / Multi-venue Mewah) ────────────────────────────

const GRAND_TASKS: TemplateTask[] = [
  // 12 bulan sebelum
  { title: "Tentukan tanggal pernikahan", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Tentukan budget total & alokasi", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Hire Wedding Organizer/Planner", category: "lainnya", priority: "urgent", monthsBefore: 12 },
  { title: "Buat daftar tamu undangan awal", category: "undangan", priority: "high", monthsBefore: 12 },
  { title: "Riset dan survei venue akad", category: "venue", priority: "high", monthsBefore: 12 },
  { title: "Riset dan survei venue resepsi", category: "venue", priority: "high", monthsBefore: 12 },
  { title: "Tentukan tema & color palette pernikahan", category: "dekorasi", priority: "high", monthsBefore: 12 },
  { title: "Buat moodboard dekorasi", category: "dekorasi", priority: "medium", monthsBefore: 12 },

  // 10 bulan sebelum
  { title: "Booking venue akad nikah", category: "venue", priority: "urgent", monthsBefore: 10 },
  { title: "Booking venue resepsi", category: "venue", priority: "urgent", monthsBefore: 10 },
  { title: "Booking venue after-party (opsional)", category: "venue", priority: "low", monthsBefore: 10 },
  { title: "Cari katering premium", category: "catering", priority: "high", monthsBefore: 10 },
  { title: "Cari fotografer & videografer premium", category: "fotografi", priority: "high", monthsBefore: 10 },
  { title: "Cari dekorator premium", category: "dekorasi", priority: "high", monthsBefore: 10 },
  { title: "Cari entertainment/band live", category: "lainnya", priority: "medium", monthsBefore: 10 },

  // 8 bulan sebelum
  { title: "Booking katering (tasting session)", category: "catering", priority: "urgent", monthsBefore: 8 },
  { title: "Booking fotografer & videografer", category: "fotografi", priority: "urgent", monthsBefore: 8 },
  { title: "Booking dekorator", category: "dekorasi", priority: "high", monthsBefore: 8 },
  { title: "Booking entertainment/band", category: "lainnya", priority: "high", monthsBefore: 8 },
  { title: "Cari desainer baju pengantin", category: "busana", priority: "high", monthsBefore: 8 },
  { title: "Cari MUA premium", category: "busana", priority: "high", monthsBefore: 8 },
  { title: "Pesan cincin pernikahan custom", category: "busana", priority: "high", monthsBefore: 8 },
  { title: "Booking MC profesional", category: "lainnya", priority: "medium", monthsBefore: 8 },
  { title: "Cari lighting & sound vendor", category: "dekorasi", priority: "medium", monthsBefore: 8 },

  // 6 bulan sebelum
  { title: "Booking MUA (termasuk keluarga)", category: "busana", priority: "high", monthsBefore: 6 },
  { title: "Desain dan produksi baju pengantin", category: "busana", priority: "high", monthsBefore: 6 },
  { title: "Urus surat-surat nikah (KUA/Catatan Sipil)", category: "lainnya", priority: "urgent", monthsBefore: 6 },
  { title: "Siapkan mahar mewah", category: "lainnya", priority: "high", monthsBefore: 6 },
  { title: "Pilih menu katering (multi-course)", category: "catering", priority: "high", monthsBefore: 6 },
  { title: "Pilih kue pengantin multi-tier", category: "catering", priority: "medium", monthsBefore: 6 },
  { title: "Desain souvenir premium", category: "lainnya", priority: "medium", monthsBefore: 6 },
  { title: "Booking videografi cinematic", category: "fotografi", priority: "medium", monthsBefore: 6 },
  { title: "Pre-wedding photoshoot planning", category: "fotografi", priority: "medium", monthsBefore: 6 },

  // 5 bulan sebelum
  { title: "Pre-wedding photoshoot", category: "fotografi", priority: "high", monthsBefore: 5 },
  { title: "Pesan seserahan mewah", category: "lainnya", priority: "medium", monthsBefore: 5 },
  { title: "Booking hotel untuk tamu luar kota", category: "lainnya", priority: "medium", monthsBefore: 5 },
  { title: "Cari dan booking transport (mobil mewah)", category: "lainnya", priority: "medium", monthsBefore: 5 },

  // 4 bulan sebelum
  { title: "Finalisasi daftar tamu (500+)", category: "undangan", priority: "urgent", monthsBefore: 4 },
  { title: "Desain undangan premium (cetak)", category: "undangan", priority: "high", monthsBefore: 4 },
  { title: "Desain undangan digital/website", category: "undangan", priority: "high", monthsBefore: 4 },
  { title: "Fitting baju pengantin pertama", category: "busana", priority: "high", monthsBefore: 4 },
  { title: "Fitting baju keluarga pengantin", category: "busana", priority: "medium", monthsBefore: 4 },
  { title: "Pilih bunga & florist", category: "dekorasi", priority: "medium", monthsBefore: 4 },

  // 3 bulan sebelum
  { title: "Cetak undangan premium", category: "undangan", priority: "high", monthsBefore: 3 },
  { title: "Produksi souvenir premium", category: "lainnya", priority: "medium", monthsBefore: 3 },
  { title: "Fitting baju pengantin kedua", category: "busana", priority: "medium", monthsBefore: 3 },
  { title: "Trial make-up & hair pengantin", category: "busana", priority: "high", monthsBefore: 3 },
  { title: "Trial make-up keluarga", category: "busana", priority: "medium", monthsBefore: 3 },
  { title: "Susun rundown acara detail", category: "lainnya", priority: "high", monthsBefore: 3 },

  // 2 bulan sebelum
  { title: "Kirim undangan cetak", category: "undangan", priority: "urgent", monthsBefore: 2 },
  { title: "Kirim undangan digital", category: "undangan", priority: "high", monthsBefore: 2 },
  { title: "Pesan kue pengantin", category: "catering", priority: "high", monthsBefore: 2 },
  { title: "Buat denah meja tamu", category: "undangan", priority: "high", monthsBefore: 2 },
  { title: "Cek dekorasi mock-up dengan dekorator", category: "dekorasi", priority: "high", monthsBefore: 2 },
  { title: "Pesan bunga segar untuk hari H", category: "dekorasi", priority: "medium", monthsBefore: 2 },

  // 1 bulan sebelum
  { title: "Konfirmasi semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 1 },
  { title: "Bayar pelunasan semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 1 },
  { title: "Fitting baju pengantin final", category: "busana", priority: "high", monthsBefore: 1 },
  { title: "Follow up RSVP tamu undangan", category: "undangan", priority: "high", monthsBefore: 1 },
  { title: "Finalisasi denah meja tamu", category: "undangan", priority: "high", monthsBefore: 1 },
  { title: "Siapkan souvenir & goodie bag", category: "lainnya", priority: "medium", monthsBefore: 1 },
  { title: "Siapkan angpao/tip untuk vendor", category: "lainnya", priority: "medium", monthsBefore: 1 },
  { title: "Cek kesiapan hotel tamu", category: "lainnya", priority: "medium", monthsBefore: 1 },
  { title: "Cek kesiapan transport", category: "lainnya", priority: "medium", monthsBefore: 1 },

  // 2 minggu sebelum
  { title: "Technical meeting semua vendor", category: "lainnya", priority: "urgent", monthsBefore: 0.5 },
  { title: "Konfirmasi final jumlah tamu", category: "undangan", priority: "urgent", monthsBefore: 0.5 },
  { title: "Briefing MC, WO, dan keluarga", category: "lainnya", priority: "high", monthsBefore: 0.5 },
  { title: "Cek kelengkapan dekorasi & lighting", category: "dekorasi", priority: "high", monthsBefore: 0.5 },
  { title: "Cek sound system & playlist", category: "lainnya", priority: "medium", monthsBefore: 0.5 },

  // 1 minggu sebelum
  { title: "Siapkan semua pakaian & aksesoris", category: "busana", priority: "high", monthsBefore: 0.25 },
  { title: "Cek kesiapan semua venue", category: "venue", priority: "high", monthsBefore: 0.25 },
  { title: "Siapkan kotak angpao & buku tamu", category: "lainnya", priority: "medium", monthsBefore: 0.25 },
  { title: "Final walkthrough venue dengan WO", category: "venue", priority: "high", monthsBefore: 0.25 },

  // Hari H
  { title: "Gladi resik / rehearsal dinner", category: "lainnya", priority: "urgent", monthsBefore: 0.03 },
  { title: "Setup dekorasi semua venue", category: "dekorasi", priority: "urgent", monthsBefore: 0.03 },
  { title: "Akad nikah", category: "lainnya", priority: "urgent", monthsBefore: 0 },
  { title: "Resepsi pernikahan", category: "lainnya", priority: "urgent", monthsBefore: 0 },
];

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "simple",
    name: "Pernikahan Sederhana",
    description: "Intimate & budget-friendly — checklist ringkas untuk pernikahan sederhana",
    tasks: SIMPLE_TASKS,
  },
  {
    id: "standard",
    name: "Pernikahan Standard",
    description: "Resepsi lengkap — checklist standar untuk pernikahan dengan resepsi",
    tasks: STANDARD_TASKS,
  },
  {
    id: "grand",
    name: "Pernikahan Besar",
    description: "Multi-venue & mewah — checklist lengkap untuk pernikahan besar",
    tasks: GRAND_TASKS,
  },
];

/**
 * Calculate absolute due date from months before wedding.
 */
export function calculateDueDate(weddingDate: string, monthsBefore: number): string {
  const wedding = new Date(weddingDate);
  const due = new Date(wedding);
  due.setMonth(due.getMonth() - Math.floor(monthsBefore));
  // Handle fractional months (weeks)
  const fractional = monthsBefore - Math.floor(monthsBefore);
  if (fractional > 0) {
    due.setDate(due.getDate() - Math.round(fractional * 30));
  }
  // Don't set due date in the past — minimum is today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const finalDate = due < today ? today : due;
  return finalDate.toISOString().split("T")[0];
}
