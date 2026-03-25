-- Add seserahan actual_price back into budget spent_amount calculation.
-- The purchase-status-toggle updates actual_price directly on seserahan
-- without creating expense records, so the trigger must include it.

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

  -- spent_amount = expenses + seserahan actual purchases
  SELECT
    COALESCE((SELECT SUM(amount) FROM expenses WHERE wedding_id = v_wedding_id), 0) +
    COALESCE((SELECT SUM(actual_price) FROM seserahan WHERE wedding_id = v_wedding_id AND purchase_status IN ('sudah_dibeli', 'sudah_diterima')), 0)
  INTO v_total;

  UPDATE budgets SET spent_amount = v_total WHERE wedding_id = v_wedding_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
