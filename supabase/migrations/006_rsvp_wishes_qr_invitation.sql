-- ==========================================
-- NIKAHKU Migration 006
-- RSVP Publik, Ucapan Real-time, QR Souvenir & Halaman Undangan
-- ==========================================

-- ==========================================
-- 1. FUNGSI GENERATE NANO ID (PostgreSQL)
--    Dipakai untuk batch-populate tamu existing
-- ==========================================

CREATE OR REPLACE FUNCTION generate_nano_id(size INT DEFAULT 5)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet TEXT := '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result   TEXT := '';
  i        INT;
BEGIN
  FOR i IN 1..size LOOP
    result := result || substr(alphabet, floor(random() * length(alphabet) + 1)::INT, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- ==========================================
-- 2. KOLOM BARU DI TABEL guests
-- ==========================================

-- NanoID: identitas publik tamu (5 karakter, unik global)
ALTER TABLE guests ADD COLUMN IF NOT EXISTS nano_id CHAR(5);
CREATE UNIQUE INDEX IF NOT EXISTS guests_nano_id_idx ON guests(nano_id);

-- Souvenir tracking
ALTER TABLE guests ADD COLUMN IF NOT EXISTS souvenir_taken     BOOLEAN     NOT NULL DEFAULT false;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS souvenir_taken_at  TIMESTAMPTZ;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS souvenir_taken_by  TEXT;

-- ==========================================
-- 3. BATCH GENERATE NANO ID UNTUK TAMU EXISTING
--    Retry jika collision (probabilitas sangat kecil)
-- ==========================================

DO $$
DECLARE
  rec      RECORD;
  new_id   TEXT;
  attempts INT;
BEGIN
  FOR rec IN SELECT id FROM guests WHERE nano_id IS NULL LOOP
    attempts := 0;
    LOOP
      new_id := generate_nano_id(5);
      BEGIN
        UPDATE guests SET nano_id = new_id WHERE id = rec.id;
        EXIT;  -- sukses, keluar inner loop
      EXCEPTION WHEN unique_violation THEN
        attempts := attempts + 1;
        IF attempts > 20 THEN
          RAISE EXCEPTION 'Gagal generate nano_id unik setelah 20 percobaan untuk guest %', rec.id;
        END IF;
      END;
    END LOOP;
  END LOOP;
END;
$$;

-- Setelah semua terisi, enforce NOT NULL
ALTER TABLE guests ALTER COLUMN nano_id SET NOT NULL;

-- ==========================================
-- 4. KOLOM BARU DI TABEL weddings (RSVP config)
-- ==========================================

ALTER TABLE weddings ADD COLUMN IF NOT EXISTS rsvp_enabled          BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS rsvp_slug             TEXT;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS rsvp_closes_at        TIMESTAMPTZ;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS rsvp_max_pax_per_guest INT     NOT NULL DEFAULT 5;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS scanner_pin           CHAR(4);

CREATE UNIQUE INDEX IF NOT EXISTS weddings_rsvp_slug_idx ON weddings(rsvp_slug);

-- ==========================================
-- 5. TABEL invitations (halaman undangan publik)
-- ==========================================

CREATE TABLE IF NOT EXISTS invitations (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id       UUID        NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  slug             TEXT        NOT NULL UNIQUE,
  published        BOOLEAN     NOT NULL DEFAULT false,

  -- Konten
  headline         TEXT        NOT NULL DEFAULT 'Undangan Pernikahan',
  opening_text     TEXT,
  closing_text     TEXT,
  groom_full_name  TEXT,
  bride_full_name  TEXT,
  groom_nickname   TEXT,
  bride_nickname   TEXT,
  groom_parents    TEXT,
  bride_parents    TEXT,

  -- Media
  hero_photo_url   TEXT,
  gallery_urls     TEXT[]      NOT NULL DEFAULT '{}',

  -- Tema
  template         TEXT        NOT NULL DEFAULT 'classic'
                               CHECK (template IN ('classic', 'modern', 'rustic')),
  theme_color      TEXT        NOT NULL DEFAULT '#8B6F4E',
  font_heading     TEXT        NOT NULL DEFAULT 'playfair'
                               CHECK (font_heading IN ('playfair', 'cormorant', 'montserrat')),

  -- Social
  hashtag          TEXT,
  love_story_text  TEXT,

  -- Settings
  show_rsvp        BOOLEAN     NOT NULL DEFAULT true,
  show_wishes      BOOLEAN     NOT NULL DEFAULT true,

  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 6. TABEL wishes (ucapan tamu — 1x per NanoID)
-- ==========================================

CREATE TABLE IF NOT EXISTS wishes (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id  UUID        NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  guest_id    UUID        REFERENCES guests(id) ON DELETE SET NULL,
  guest_name  TEXT        NOT NULL,
  message     TEXT        NOT NULL CHECK (char_length(message) <= 500),
  is_visible  BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 1 ucapan per tamu per wedding
  CONSTRAINT wishes_one_per_guest UNIQUE (wedding_id, guest_id)
);

CREATE INDEX IF NOT EXISTS wishes_wedding_id_idx ON wishes(wedding_id);
CREATE INDEX IF NOT EXISTS wishes_created_at_idx ON wishes(created_at DESC);

-- ==========================================
-- 7. TRIGGER: updated_at otomatis
-- ==========================================

-- Gunakan fungsi trigger yang sama dengan tabel lain
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER wishes_updated_at
  BEFORE UPDATE ON wishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- ── invitations ──────────────────────────

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Publik: bisa baca hanya jika published
CREATE POLICY "invitations_public_read" ON invitations
  FOR SELECT
  USING (published = true);

-- Owner (dan partner): full access
CREATE POLICY "invitations_owner_all" ON invitations
  FOR ALL
  USING (wedding_id IN (SELECT get_my_wedding_ids()))
  WITH CHECK (wedding_id IN (SELECT get_my_wedding_ids()));

-- ── wishes ───────────────────────────────

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Publik: baca ucapan yang visible
CREATE POLICY "wishes_public_read" ON wishes
  FOR SELECT
  USING (is_visible = true);

-- Publik: insert ucapan baru (rate limit di application layer)
CREATE POLICY "wishes_public_insert" ON wishes
  FOR INSERT
  WITH CHECK (
    -- wedding harus punya rsvp_enabled = true
    wedding_id IN (SELECT id FROM weddings WHERE rsvp_enabled = true)
  );

-- Publik: update ucapan sendiri (validasi guest_id di application layer)
CREATE POLICY "wishes_public_update" ON wishes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Owner (dan partner): full access (moderasi)
CREATE POLICY "wishes_owner_all" ON wishes
  FOR ALL
  USING (wedding_id IN (SELECT get_my_wedding_ids()))
  WITH CHECK (wedding_id IN (SELECT get_my_wedding_ids()));

-- ── guests: public read untuk RSVP & scanner ──

-- Drop policy lama jika ada, lalu buat yang baru
DROP POLICY IF EXISTS "guests_public_rsvp_read" ON guests;

CREATE POLICY "guests_public_rsvp_read" ON guests
  FOR SELECT
  USING (
    wedding_id IN (SELECT id FROM weddings WHERE rsvp_enabled = true)
  );

-- Public update RSVP status (hanya field yang diizinkan, validasi di app layer)
CREATE POLICY "guests_public_rsvp_update" ON guests
  FOR UPDATE
  USING (
    wedding_id IN (SELECT id FROM weddings WHERE rsvp_enabled = true)
  )
  WITH CHECK (
    wedding_id IN (SELECT id FROM weddings WHERE rsvp_enabled = true)
  );

-- ==========================================
-- 9. REALTIME — tambah tabel baru ke publikasi
-- ==========================================

ALTER PUBLICATION supabase_realtime ADD TABLE invitations;
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;

-- ==========================================
-- 10. INDEX TAMBAHAN untuk performa lookup
-- ==========================================

-- Lookup invitation by slug (untuk halaman publik /i/[slug])
CREATE INDEX IF NOT EXISTS invitations_slug_idx ON invitations(slug);

-- Lookup guest by nano_id (untuk RSVP publik & scanner)
-- (sudah dibuat di bagian 2, index unik)

-- Lookup wishes by guest_id (untuk cek 1x per tamu)
CREATE INDEX IF NOT EXISTS wishes_guest_id_idx ON wishes(guest_id);
