/**
 * Variables that can be used in templates:
 * [nama]     → guest name
 * [kode]     → NanoID (5 char)
 * [link]     → full invitation URL
 * [pasangan] → couple name
 * [tanggal]  → wedding date
 */
export function applyTemplateVariables(
  body: string,
  vars: {
    nama: string;
    kode: string;
    link: string;
    pasangan: string;
    tanggal?: string;
  }
): string {
  return body
    .replace(/\[nama\]/gi, vars.nama)
    .replace(/\[kode\]/gi, vars.kode)
    .replace(/\[link\]/gi, vars.link)
    .replace(/\[pasangan\]/gi, vars.pasangan)
    .replace(/\[tanggal\]/gi, vars.tanggal ?? "");
}

export function buildWhatsappUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  const normalized = clean.startsWith("0") ? "62" + clean.slice(1) : clean;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export const TEMPLATE_VARIABLES = [
  { key: "[nama]", desc: "Nama tamu" },
  { key: "[kode]", desc: "Kode undangan (NanoID)" },
  { key: "[link]", desc: "Link undangan personal" },
  { key: "[pasangan]", desc: "Nama pasangan pengantin" },
  { key: "[tanggal]", desc: "Tanggal pernikahan" },
];

export type TemplateSuggestion = {
  name: string;
  category: "formal" | "kasual" | "fun" | "islami" | "singkat" | "keluarga" | "vip";
  categoryLabel: string;
  body: string;
};

export const TEMPLATE_SUGGESTIONS: TemplateSuggestion[] = [
  // ── Formal ────────────────────────────────────────────────────────────────
  {
    name: "Formal – Umum",
    category: "formal",
    categoryLabel: "Formal",
    body: `Yth. Bapak/Ibu/Saudara/i *[nama]*,\n\nDengan penuh rasa syukur dan kebahagiaan, kami mengundang kehadiran Anda dalam resepsi pernikahan kami.\n\n📩 Undangan digital & konfirmasi kehadiran:\n[link]\n\n🔑 Kode undangan Anda: *[kode]*\n\nKehadiran Anda merupakan kehormatan dan kebahagiaan bagi kami.\n\nHormat kami,\n*[pasangan]*`,
  },
  {
    name: "Formal – Pernikahan Adat",
    category: "formal",
    categoryLabel: "Formal",
    body: `Kepada Yth.\n*[nama]*\n\nBersama ini kami menyampaikan undangan pernikahan putra-putri kami yang akan diselenggarakan pada *[tanggal]*.\n\nKami memohon kehadiran Bapak/Ibu/Saudara/i untuk turut memberikan doa restu.\n\n🔗 Detail acara & konfirmasi:\n[link]\n\nKode: *[kode]*\n\nAtas perkenan dan doa restunya kami haturkan terima kasih.\n\n*[pasangan]*`,
  },

  // ── Kasual ────────────────────────────────────────────────────────────────
  {
    name: "Kasual – Santai",
    category: "kasual",
    categoryLabel: "Kasual",
    body: `Hei [nama]! 👋\n\nKami mau kabar baik nih — kami akan menikah! 🎊\n\nYuk cek undangan & konfirmasi kehadiran kamu di sini:\n👉 [link]\n\nKode undanganmu: *[kode]*\n\nDitunggu ya! 😊\n— *[pasangan]*`,
  },
  {
    name: "Kasual – Teman Dekat",
    category: "kasual",
    categoryLabel: "Kasual",
    body: `[nama]! 🥳\n\nGak kerasa ya, akhirnya kita sampai di momen ini!\nAku mau nikahhh dan *kamu harus datang* dong 🙏\n\nUndanganmu ada di sini:\n[link]\n\nKode kamu: *[kode]*\n\nSampai jumpa di hari bahagia kita!\nLove, *[pasangan]* 💕`,
  },

  // ── Fun / Playful ──────────────────────────────────────────────────────────
  {
    name: "Fun – Playful",
    category: "fun",
    categoryLabel: "Fun",
    body: `PSST! [nama] 👀\n\n*Breaking news:* [pasangan] akhirnya resmi jadian selamanya! 💍🎉\n\nKamu WAJIB hadir buat nyaksiin momen bersejarah ini!\n\n📲 Buka undanganmu:\n[link]\n\nKode rahasia: *[kode]*\n\nJangan sampai ketinggalan ya, nanti nyesel lho! 😜`,
  },
  {
    name: "Fun – Anak Muda",
    category: "fun",
    categoryLabel: "Fun",
    body: `Yo [nama]! 🔥\n\nVibes nikahan [pasangan] udah mau mulai dan lo diundang bestie! ✨\n\nSwipe up — eh maksudnya klik di sini:\n[link]\n\nKode lo: *[kode]*\n\nGas hadir ya, bakal seru banget! 🙌`,
  },
  {
    name: "Fun – Countdown",
    category: "fun",
    categoryLabel: "Fun",
    body: `⏰ SAVE THE DATE!\n\nHai [nama]! Kami resmi mengumumkan bahwa *[pasangan]* akan menikah pada *[tanggal]* — dan kamu ada di list VIP kami! 🌟\n\n🎟️ Ambil undanganmu sekarang:\n[link]\n\nKode: *[kode]*\n\nCatat di kalender dan jangan lupa hadir! 📅`,
  },

  // ── Islami ─────────────────────────────────────────────────────────────────
  {
    name: "Islami – Formal",
    category: "islami",
    categoryLabel: "Islami",
    body: `Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nYth. Bapak/Ibu/Saudara/i *[nama]*,\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Anda dalam walimatul 'ursy putra-putri kami.\n\n📩 Undangan digital:\n[link]\n\n🔑 Kode undangan: *[kode]*\n\nKehadiran dan doa restu Anda adalah kebahagiaan terbesar bagi kami.\n\nJazakumullahu Khairan,\n*[pasangan]*\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh`,
  },
  {
    name: "Islami – Kasual",
    category: "islami",
    categoryLabel: "Islami",
    body: `Assalamu'alaikum [nama] 🌙\n\nAlhamdulillah, dengan izin Allah kami akan segera melangsungkan pernikahan pada *[tanggal]*.\n\nInsyaAllah kami sangat mengharapkan doa dan kehadiran Antum 🤲\n\n📲 Undangan lengkap:\n[link]\n\nKode: *[kode]*\n\nBarakallahu fiikum 💚\n— *[pasangan]*`,
  },

  // ── Singkat ────────────────────────────────────────────────────────────────
  {
    name: "Singkat & Padat",
    category: "singkat",
    categoryLabel: "Singkat",
    body: `Hai *[nama]*! 👋\n\nKami mengundang kamu ke pernikahan kami *[tanggal]*.\n\n🔗 [link]\nKode: *[kode]*\n\nSampai jumpa! 🎊\n*[pasangan]*`,
  },
  {
    name: "Singkat – Reminder",
    category: "singkat",
    categoryLabel: "Singkat",
    body: `Halo *[nama]*! 😊\n\nSekadar mengingatkan, undangan pernikahan kami sudah tersedia:\n[link]\n\nKode undangan: *[kode]*\n\nMohon konfirmasi kehadiran ya!\n*[pasangan]*`,
  },

  // ── Keluarga ───────────────────────────────────────────────────────────────
  {
    name: "Keluarga – Hangat",
    category: "keluarga",
    categoryLabel: "Keluarga",
    body: `Assalamu'alaikum / Salam hangat, *[nama]* 🤗\n\nDengan sukacita kami mengabarkan bahwa Allah telah mengizinkan kami untuk bersatu dalam ikatan suci pernikahan pada *[tanggal]*.\n\nTak ada kebahagiaan yang lebih indah selain merayakannya bersama keluarga tercinta.\n\n🌸 Undangan lengkap:\n[link]\n\nKode: *[kode]*\n\nDengan cinta,\n*[pasangan]*`,
  },
  {
    name: "Keluarga – Besar",
    category: "keluarga",
    categoryLabel: "Keluarga",
    body: `Kepada [nama] yang kami sayangi 💛\n\nKabar bahagia! Kami akan melangsungkan pernikahan pada *[tanggal]* dan sangat berharap seluruh keluarga dapat hadir bersama-sama.\n\nSilakan buka undangan digital di:\n[link]\n\nKode undangan: *[kode]*\n\nKehadiran dan doa kalian adalah hadiah terbesar bagi kami 🙏\n*[pasangan]*`,
  },

  // ── VIP ───────────────────────────────────────────────────────────────────
  {
    name: "VIP / Eksklusif",
    category: "vip",
    categoryLabel: "VIP",
    body: `Dear *[nama]*,\n\nIt is with great joy that we invite you to celebrate our special day.\n\n✨ You are among our most cherished guests, and your presence would mean the world to us.\n\n🎟️ Your personal invitation:\n[link]\n\nYour exclusive code: *[kode]*\n\nWe look forward to celebrating with you.\n\nWith love,\n*[pasangan]*`,
  },
];

// Legacy export untuk backward compatibility
export const DEFAULT_TEMPLATES = TEMPLATE_SUGGESTIONS.slice(0, 2).map(({ name, body }) => ({ name, body }));
