-- ==========================================
-- NIKAHKU Database Schema
-- Supabase PostgreSQL
-- Ordered by foreign key dependencies
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. WEDDINGS (root table, depends on auth.users only)
-- ==========================================

CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_1_name TEXT NOT NULL,
  partner_2_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  venue_city TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. BUDGETS (depends on weddings)
-- ==========================================

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  total_amount BIGINT NOT NULL DEFAULT 0,
  spent_amount BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 3. VENDOR CATEGORIES (depends on weddings)
--    Must come BEFORE budget_allocations & vendors
-- ==========================================

CREATE TABLE vendor_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '➕',
  color TEXT NOT NULL DEFAULT '#8B6F4E',
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 4. BUDGET ALLOCATIONS (depends on weddings + vendor_categories)
-- ==========================================

CREATE TABLE budget_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES vendor_categories(id) ON DELETE CASCADE,
  allocated_amount BIGINT NOT NULL DEFAULT 0,
  UNIQUE(wedding_id, category_id)
);

-- ==========================================
-- 5. VENDORS (depends on weddings + vendor_categories)
-- ==========================================

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES vendor_categories(id),
  name TEXT NOT NULL,
  contact_phone TEXT,
  contact_wa TEXT,
  email TEXT,
  instagram TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'shortlisted' CHECK (status IN (
    'shortlisted', 'contacted', 'negotiating', 'booked',
    'paid_dp', 'paid_full', 'completed', 'cancelled'
  )),
  pros TEXT,
  cons TEXT,
  notes TEXT,
  booking_date DATE,
  selected_package_id UUID,
  price_deal BIGINT,
  dp_amount BIGINT,
  dp_paid_date DATE,
  full_paid_date DATE,
  payment_deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 6. VENDOR PACKAGES (depends on vendors)
-- ==========================================

CREATE TABLE vendor_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  includes TEXT[],
  excludes TEXT[],
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 7. VENDOR IMAGES (depends on vendors)
-- ==========================================

CREATE TABLE vendor_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 8. EXPENSES (depends on weddings + vendors)
-- ==========================================

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 9. MAHAR & SESERAHAN (depends on weddings)
-- ==========================================

CREATE TABLE seserahan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mahar', 'seserahan')),
  sub_category TEXT,
  brand TEXT,
  price_min BIGINT NOT NULL DEFAULT 0,
  price_max BIGINT NOT NULL DEFAULT 0,
  shop_url TEXT,
  shop_platform TEXT,
  purchase_status TEXT NOT NULL DEFAULT 'belum_dibeli' CHECK (purchase_status IN (
    'belum_dibeli', 'sudah_dibeli', 'sudah_diterima'
  )),
  actual_price BIGINT,
  purchase_date DATE,
  priority TEXT NOT NULL DEFAULT 'sedang' CHECK (priority IN ('tinggi', 'sedang', 'rendah')),
  sort_order INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 10. SESSIONS (depends on weddings)
-- ==========================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  session_date DATE,
  time_start TIME,
  time_end TIME,
  venue TEXT,
  max_capacity INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 11. GUESTS (depends on weddings)
-- ==========================================

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'lainnya',
  phone TEXT,
  email TEXT,
  pax_count INT NOT NULL DEFAULT 1,
  address TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'belum_diundang' CHECK (rsvp_status IN (
    'belum_diundang', 'undangan_terkirim', 'hadir', 'tidak_hadir', 'belum_konfirmasi'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 12. GUEST SESSIONS (depends on guests + sessions)
-- ==========================================

CREATE TABLE guest_sessions (
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  PRIMARY KEY (guest_id, session_id)
);

-- ==========================================
-- 13. TASKS (depends on weddings + vendors)
-- ==========================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'lainnya',
  start_date DATE,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  assignee TEXT,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  column_id TEXT NOT NULL DEFAULT 'todo',
  sort_order INT NOT NULL DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 14. PUSH SUBSCRIPTIONS (depends on auth.users)
-- ==========================================

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_weddings_user_id ON weddings(user_id);
CREATE INDEX idx_vendors_wedding_id ON vendors(wedding_id);
CREATE INDEX idx_vendors_category_id ON vendors(category_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_expenses_wedding_id ON expenses(wedding_id);
CREATE INDEX idx_seserahan_wedding_id ON seserahan(wedding_id);
CREATE INDEX idx_seserahan_status ON seserahan(purchase_status);
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_guests_rsvp ON guests(rsvp_status);
CREATE INDEX idx_tasks_wedding_id ON tasks(wedding_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE seserahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Weddings: user access own
CREATE POLICY "Users access own weddings" ON weddings
  FOR ALL USING (user_id = auth.uid());

-- Budgets
CREATE POLICY "Users access own budgets" ON budgets
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Budget Allocations
CREATE POLICY "Users access own budget_allocations" ON budget_allocations
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Vendor Categories (global defaults readable by all, custom by owner)
CREATE POLICY "Users read default vendor_categories" ON vendor_categories
  FOR SELECT USING (is_default = true AND wedding_id IS NULL);

CREATE POLICY "Users access own vendor_categories" ON vendor_categories
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Vendors
CREATE POLICY "Users access own vendors" ON vendors
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Vendor Packages
CREATE POLICY "Users access own vendor_packages" ON vendor_packages
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendors WHERE wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
  ));

-- Vendor Images
CREATE POLICY "Users access own vendor_images" ON vendor_images
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendors WHERE wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
  ));

-- Expenses
CREATE POLICY "Users access own expenses" ON expenses
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Seserahan
CREATE POLICY "Users access own seserahan" ON seserahan
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Sessions
CREATE POLICY "Users access own sessions" ON sessions
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Guests
CREATE POLICY "Users access own guests" ON guests
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Guest Sessions
CREATE POLICY "Users access own guest_sessions" ON guest_sessions
  FOR ALL USING (
    guest_id IN (
      SELECT id FROM guests WHERE wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
    )
  );

-- Tasks
CREATE POLICY "Users access own tasks" ON tasks
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Push Subscriptions
CREATE POLICY "Users access own push_subscriptions" ON push_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- ==========================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_weddings_updated_at BEFORE UPDATE ON weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_seserahan_updated_at BEFORE UPDATE ON seserahan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-recalculate budget spent_amount
CREATE OR REPLACE FUNCTION recalculate_budget()
RETURNS TRIGGER AS $$
DECLARE
  v_wedding_id UUID;
  v_total BIGINT;
BEGIN
  IF TG_TABLE_NAME = 'expenses' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  ELSIF TG_TABLE_NAME = 'vendors' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  ELSIF TG_TABLE_NAME = 'seserahan' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  END IF;

  SELECT
    COALESCE((SELECT SUM(amount) FROM expenses WHERE wedding_id = v_wedding_id), 0) +
    COALESCE((SELECT SUM(price_deal) FROM vendors WHERE wedding_id = v_wedding_id AND status IN ('booked', 'paid_dp', 'paid_full', 'completed')), 0) +
    COALESCE((SELECT SUM(actual_price) FROM seserahan WHERE wedding_id = v_wedding_id AND purchase_status IN ('sudah_dibeli', 'sudah_diterima')), 0)
  INTO v_total;

  UPDATE budgets SET spent_amount = v_total WHERE wedding_id = v_wedding_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_expenses_budget AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();
CREATE TRIGGER tr_vendors_budget AFTER UPDATE OF status, price_deal ON vendors
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();
CREATE TRIGGER tr_seserahan_budget AFTER UPDATE OF purchase_status, actual_price ON seserahan
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();

-- ==========================================
-- SEED: Default Vendor Categories
-- ==========================================

INSERT INTO vendor_categories (name, icon, color, is_default, sort_order) VALUES
  ('Catering', '🍽️', '#E07A5F', true, 1),
  ('Venue / Gedung', '🏛️', '#3D405B', true, 2),
  ('Attire & Make Up', '👰', '#C9917A', true, 3),
  ('Photo & Video', '📸', '#81B29A', true, 4),
  ('Dekorasi', '🌸', '#F2CC8F', true, 5),
  ('Entertainment / MC', '🎤', '#8B6F4E', true, 6),
  ('Undangan / Percetakan', '💌', '#D4A574', true, 7),
  ('Souvenir', '🎁', '#6B8DAE', true, 8),
  ('Transportasi', '🚗', '#5B8C5A', true, 9),
  ('Akomodasi', '🏨', '#9C8E7E', true, 10),
  ('Henna / Mehendi', '🤲', '#C75C5C', true, 11),
  ('Lain-lain', '➕', '#2C2418', true, 12);
