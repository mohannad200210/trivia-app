-- 0002_super_categories.sql
-- Adds super_categories table and extends categories with display metadata.
-- Run after 0001_board_schema.sql.

CREATE TABLE IF NOT EXISTS super_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar    text NOT NULL UNIQUE,
  icon_emoji text,                    -- fallback emoji if no image
  icon_url   text,                    -- realistic photo URL (Unsplash/Wikipedia)
  sort_order int  DEFAULT 0
);

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS super_category_id  uuid REFERENCES super_categories(id),
  ADD COLUMN IF NOT EXISTS cover_image_url    text,    -- card hero photo URL
  ADD COLUMN IF NOT EXISTS remaining_games    int,     -- static count from seed
  ADD COLUMN IF NOT EXISTS star_rating        int CHECK (star_rating BETWEEN 1 AND 3);
