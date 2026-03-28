-- ─── WhatsApp Templates ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id   UUID        NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  is_default   BOOLEAN     NOT NULL DEFAULT false,
  sort_order   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_whatsapp_templates"
  ON whatsapp_templates FOR ALL
  USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()))
  WITH CHECK (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_whatsapp_templates
  BEFORE UPDATE ON whatsapp_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
