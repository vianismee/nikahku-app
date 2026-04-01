-- ==========================================
-- 008: Invitation Media, Love Story & Basic Template
-- ==========================================

-- 0. Tambah "basic" ke template enum constraint
ALTER TABLE invitations DROP CONSTRAINT IF EXISTS invitations_template_check;
ALTER TABLE invitations ADD CONSTRAINT invitations_template_check
  CHECK (template IN ('basic', 'classic', 'modern', 'rustic'));

-- Update default template ke 'basic'
ALTER TABLE invitations ALTER COLUMN template SET DEFAULT 'basic';

-- 1. sessions: tambah venue_maps_url
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS venue_maps_url TEXT;

-- 2. invitations: tambah love_story (JSON array [{tahun, cerita}])
--    love_story_text tetap ada sebagai InvitationExtra (instagram, gifts, fonts, etc.)
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS love_story TEXT;

-- 3. invitations: foto profil mempelai pria & wanita
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_photo_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_photo_url TEXT;

-- 4. Supabase Storage bucket untuk media undangan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invitation-media',
  'invitation-media',
  true,
  2097152, -- 2MB max per upload (enforced per-path in app)
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS: pemilik wedding bisa upload, publik bisa baca
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'invitation_media_public_read'
  ) THEN
    CREATE POLICY "invitation_media_public_read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'invitation-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'invitation_media_owner_upload'
  ) THEN
    CREATE POLICY "invitation_media_owner_upload"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'invitation-media'
        AND auth.uid() IS NOT NULL
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'invitation_media_owner_delete'
  ) THEN
    CREATE POLICY "invitation_media_owner_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'invitation-media'
        AND auth.uid() IS NOT NULL
      );
  END IF;
END $$;
