export type SessionData = {
  id: string;
  name: string;
  session_date: string | null;
  time_start: string | null;
  time_end: string | null;
  venue: string | null;
  max_capacity: number | null;
};

export type LoveStoryEntry = { tahun: string; cerita: string };

export type InvitationPageProps = {
  namaWanitaPanggil: string;
  namaWanitaLengkap: string;
  inisialWanita: string;
  ortuWanita: string;
  igWanita: string;
  igWanitaUrl: string;

  namaPriaPanggil: string;
  namaPriaLengkap: string;
  inisialPria: string;
  ortuPria: string;
  igPria: string;
  igPriaUrl: string;

  tanggalSingkat: string;
  tanggalHeader: string;
  countdownDate: string;

  akad: SessionData | null;
  resepsi: SessionData | null;

  galleryUrls: string[];
  musicUrl: string;
  heroPhotoUrl: string | null;
  hashtag: string;

  loveStory: LoveStoryEntry[];

  bankNama: string;
  bankNorek: string;
  bankAtasnama: string;
  kadoNama: string;
  kadoAlamat: string;

  slug: string;
  weddingId: string;
  rsvpMaxPax: number;
  rsvpEnabled: boolean;
  showRsvp: boolean;
  showWishes: boolean;

  sessions: SessionData[];
};
