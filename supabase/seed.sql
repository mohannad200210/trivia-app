-- supabase/seed.sql
-- Starter categories per SKILL.md §4.
-- Run against your Supabase project after applying migrations.
-- See /supabase/migrations/ for the schema CREATE TABLE statements (to be added in Phase 1).

INSERT INTO categories (name_ar, name_en, icon_url, sort_order) VALUES
  ('معلومات عامة', 'General Knowledge', NULL, 1),
  ('جغرافيا',       'Geography',         NULL, 2),
  ('رياضة',         'Sports',            NULL, 3),
  ('أفلام ومسلسلات','Movies & TV',        NULL, 4),
  ('تاريخ',         'History',           NULL, 5),
  ('علوم',          'Science',           NULL, 6),
  ('ألعاب',         'Gaming',            NULL, 7),
  ('فن وموسيقى',   'Art & Music',       NULL, 8)
ON CONFLICT DO NOTHING;
