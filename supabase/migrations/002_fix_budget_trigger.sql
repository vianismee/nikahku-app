-- Fix: Remove vendors.price_deal from spent_amount calculation.
-- Vendor payments are now tracked via individual expense records (DP, pelunasan),
-- so including price_deal would double-count the amounts.
-- Seserahan actual_price is also removed for consistency — purchases will
-- create expense records when that feature is built.

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

  -- spent_amount is now purely based on the expenses table.
  -- Vendor and seserahan payments should create expense records.
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total
  FROM expenses
  WHERE wedding_id = v_wedding_id;

  UPDATE budgets SET spent_amount = v_total WHERE wedding_id = v_wedding_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
