-- ==========================================
-- WEDDING PARTNERS (column-based approach)
-- Enables two users (both mempelai) to share
-- the same wedding dashboard using columns
-- on the weddings table directly.
-- ==========================================

-- 1. Add partner columns to weddings table
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS partner_email TEXT;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS partner_user_id UUID REFERENCES auth.users(id);
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS partner_status TEXT DEFAULT NULL
  CHECK (partner_status IN ('pending', 'accepted', 'rejected', NULL));

-- 2. Helper function: returns all wedding IDs the current user can access
--    (as owner via weddings.user_id OR as accepted partner via partner_user_id)
CREATE OR REPLACE FUNCTION get_my_wedding_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM weddings
  WHERE user_id = auth.uid()
     OR partner_user_id = auth.uid()
$$;

-- 3. Update weddings policy so partner can also read/write the wedding
DROP POLICY IF EXISTS "Users access own weddings" ON weddings;
CREATE POLICY "Users access own weddings" ON weddings
  FOR ALL USING (
    user_id = auth.uid()
    OR partner_user_id = auth.uid()
    OR partner_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 4. Update ALL other table policies to use the helper function

-- Budgets
DROP POLICY IF EXISTS "Users access own budgets" ON budgets;
CREATE POLICY "Users access own budgets" ON budgets
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Budget Allocations
DROP POLICY IF EXISTS "Users access own budget_allocations" ON budget_allocations;
CREATE POLICY "Users access own budget_allocations" ON budget_allocations
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Vendor Categories (custom ones; default policy stays)
DROP POLICY IF EXISTS "Users access own vendor_categories" ON vendor_categories;
CREATE POLICY "Users access own vendor_categories" ON vendor_categories
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Vendors
DROP POLICY IF EXISTS "Users access own vendors" ON vendors;
CREATE POLICY "Users access own vendors" ON vendors
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Vendor Packages
DROP POLICY IF EXISTS "Users access own vendor_packages" ON vendor_packages;
CREATE POLICY "Users access own vendor_packages" ON vendor_packages
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendors WHERE wedding_id IN (SELECT get_my_wedding_ids())
  ));

-- Vendor Images
DROP POLICY IF EXISTS "Users access own vendor_images" ON vendor_images;
CREATE POLICY "Users access own vendor_images" ON vendor_images
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendors WHERE wedding_id IN (SELECT get_my_wedding_ids())
  ));

-- Expenses
DROP POLICY IF EXISTS "Users access own expenses" ON expenses;
CREATE POLICY "Users access own expenses" ON expenses
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Seserahan
DROP POLICY IF EXISTS "Users access own seserahan" ON seserahan;
CREATE POLICY "Users access own seserahan" ON seserahan
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Sessions
DROP POLICY IF EXISTS "Users access own sessions" ON sessions;
CREATE POLICY "Users access own sessions" ON sessions
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Guests
DROP POLICY IF EXISTS "Users access own guests" ON guests;
CREATE POLICY "Users access own guests" ON guests
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));

-- Guest Sessions
DROP POLICY IF EXISTS "Users access own guest_sessions" ON guest_sessions;
CREATE POLICY "Users access own guest_sessions" ON guest_sessions
  FOR ALL USING (
    guest_id IN (
      SELECT id FROM guests WHERE wedding_id IN (SELECT get_my_wedding_ids())
    )
  );

-- Tasks
DROP POLICY IF EXISTS "Users access own tasks" ON tasks;
CREATE POLICY "Users access own tasks" ON tasks
  FOR ALL USING (wedding_id IN (SELECT get_my_wedding_ids()));
