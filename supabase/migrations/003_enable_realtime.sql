-- Enable Supabase Realtime on all tables

ALTER PUBLICATION supabase_realtime ADD TABLE weddings;
ALTER PUBLICATION supabase_realtime ADD TABLE budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE budget_allocations;
ALTER PUBLICATION supabase_realtime ADD TABLE vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_images;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE seserahan;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;
ALTER PUBLICATION supabase_realtime ADD TABLE guest_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE push_subscriptions;
