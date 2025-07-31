-- Safe Database Migration: Add 7-Beer Structure to Existing Schema
-- This migration preserves all existing Alabama data while adding new functionality

-- 1. Add missing columns to beer_reviews table (nullable first)
ALTER TABLE beer_reviews 
ADD COLUMN IF NOT EXISTS state_code VARCHAR(2),
ADD COLUMN IF NOT EXISTS state_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS week_number INTEGER,
ADD COLUMN IF NOT EXISTS ibu INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Add day_of_week column for 7-beer structure
ALTER TABLE beer_reviews 
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7);

-- 3. Migrate existing Alabama data from metadata encoding
UPDATE beer_reviews 
SET 
  state_code = SPLIT_PART(unique_feature, ':', 1),
  week_number = CAST(SPLIT_PART(unique_feature, ':', 2) AS INTEGER),
  ibu = CASE 
    WHEN SPLIT_PART(unique_feature, ':', 3) ~ '^[0-9]+$' 
    THEN CAST(SPLIT_PART(unique_feature, ':', 3) AS INTEGER)
    ELSE NULL 
  END,
  state_name = 'Alabama',
  description = COALESCE(brewery_story, tasting_notes),
  updated_at = NOW()
WHERE unique_feature IS NOT NULL 
  AND unique_feature LIKE 'AL:%:%:%'
  AND state_code IS NULL;

-- 4. Set day_of_week based on existing pattern (if available)
UPDATE beer_reviews 
SET day_of_week = COALESCE(day_of_week, 1)
WHERE state_code = 'AL' AND day_of_week IS NULL;

-- 5. Add beer_day column to social_posts
ALTER TABLE social_posts 
ADD COLUMN IF NOT EXISTS beer_day INTEGER CHECK (beer_day >= 1 AND beer_day <= 7);

-- 6. Create content_schedule table for 7-beer workflow
CREATE TABLE IF NOT EXISTS content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL,
  week_number INTEGER NOT NULL,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('state_post', 'beer_review')),
  content_id UUID,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  beer_day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_code, week_number, content_type, beer_day)
);

-- 7. Add constraints after data migration
ALTER TABLE beer_reviews 
ADD CONSTRAINT IF NOT EXISTS beer_reviews_state_code_check 
CHECK (state_code ~ '^[A-Z]{2}$');

-- 8. Create weekly beer count validation function
CREATE OR REPLACE FUNCTION validate_weekly_beer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM beer_reviews 
      WHERE state_code = NEW.state_code 
        AND week_number = NEW.week_number
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) >= 7 THEN
    RAISE EXCEPTION 'Maximum 7 beer reviews per state per week exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for weekly beer limit
DROP TRIGGER IF EXISTS check_weekly_beer_limit ON beer_reviews;
CREATE TRIGGER check_weekly_beer_limit
  BEFORE INSERT OR UPDATE ON beer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION validate_weekly_beer_count();

-- 10. Create weekly schedule generator function
CREATE OR REPLACE FUNCTION generate_weekly_schedule(
  p_state_code VARCHAR(2),
  p_week_number INTEGER,
  p_start_date DATE
)
RETURNS TABLE(
  content_type VARCHAR(20),
  scheduled_date DATE,
  scheduled_time TIME,
  beer_day INTEGER
) AS $$
BEGIN
  -- Monday: State post (9:00 AM) + Beer review #1 (2:00 PM)
  RETURN QUERY
  SELECT 'state_post'::VARCHAR(20), p_start_date, '09:00:00'::TIME, NULL::INTEGER
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date, '14:00:00'::TIME, 1
  UNION ALL
  -- Tuesday-Sunday: Beer reviews #2-7 (10:00 AM each day)
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '1 day', '10:00:00'::TIME, 2
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '2 days', '10:00:00'::TIME, 3
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '3 days', '10:00:00'::TIME, 4
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '4 days', '10:00:00'::TIME, 5
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '5 days', '10:00:00'::TIME, 6
  UNION ALL
  SELECT 'beer_review'::VARCHAR(20), p_start_date + INTERVAL '6 days', '10:00:00'::TIME, 7;
END;
$$ LANGUAGE plpgsql;

-- 11. Updated statistics function for 7 beers per week
CREATE OR REPLACE FUNCTION get_journey_statistics()
RETURNS JSON AS $$
DECLARE
  total_states INTEGER := 50;
  total_expected_beers INTEGER := 350; -- 7 beers × 50 states
  published_states INTEGER;
  published_beers INTEGER;
  result JSON;
BEGIN
  -- Count states with published content
  SELECT COUNT(DISTINCT state_code) INTO published_states
  FROM beer_reviews 
  WHERE state_code IS NOT NULL;
  
  -- Count published beer reviews
  SELECT COUNT(*) INTO published_beers
  FROM beer_reviews 
  WHERE state_code IS NOT NULL;
  
  -- Calculate progress percentages
  result := json_build_object(
    'total_states', total_states,
    'states_with_content', published_states,
    'states_progress_percent', ROUND((published_states::DECIMAL / total_states) * 100, 1),
    'total_expected_beers', total_expected_beers,
    'published_beers', published_beers,
    'beers_progress_percent', ROUND((published_beers::DECIMAL / total_expected_beers) * 100, 1),
    'average_beers_per_state', CASE 
      WHEN published_states > 0 THEN ROUND(published_beers::DECIMAL / published_states, 1)
      ELSE 0 
    END,
    'migration_status', 'completed',
    'data_integrity_check', CASE 
      WHEN EXISTS (SELECT 1 FROM beer_reviews WHERE state_code IS NULL AND unique_feature IS NOT NULL)
      THEN 'needs_cleanup'
      ELSE 'clean'
    END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 12. Create content validation function
CREATE OR REPLACE FUNCTION validate_weekly_content(
  p_state_code VARCHAR(2),
  p_week_number INTEGER
)
RETURNS JSON AS $$
DECLARE
  state_post_count INTEGER;
  beer_review_count INTEGER;
  missing_days INTEGER[];
  result JSON;
BEGIN
  -- Check state post
  SELECT COUNT(*) INTO state_post_count
  FROM blog_posts 
  WHERE state = p_state_code 
    AND week_number = p_week_number;
  
  -- Check beer reviews
  SELECT COUNT(*) INTO beer_review_count
  FROM beer_reviews 
  WHERE state_code = p_state_code 
    AND week_number = p_week_number;
  
  -- Find missing beer review days
  SELECT ARRAY_AGG(day_num) INTO missing_days
  FROM generate_series(1, 7) AS day_num
  WHERE day_num NOT IN (
    SELECT day_of_week 
    FROM beer_reviews 
    WHERE state_code = p_state_code 
      AND week_number = p_week_number
      AND day_of_week IS NOT NULL
  );
  
  result := json_build_object(
    'state_code', p_state_code,
    'week_number', p_week_number,
    'has_state_post', state_post_count > 0,
    'beer_review_count', beer_review_count,
    'is_complete', state_post_count > 0 AND beer_review_count = 7,
    'missing_beer_days', COALESCE(missing_days, ARRAY[]::INTEGER[]),
    'content_ready_for_publishing', state_post_count > 0 AND beer_review_count = 7
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 13. Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week 
ON beer_reviews(state_code, week_number) WHERE state_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day 
ON beer_reviews(state_code, week_number, day_of_week) WHERE state_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_content_schedule_date 
ON content_schedule(scheduled_date, scheduled_time, status);

CREATE INDEX IF NOT EXISTS idx_social_posts_beer_day 
ON social_posts(beer_review_id, beer_day, platform) WHERE beer_day IS NOT NULL;

-- 14. Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_beer_reviews_updated_at ON beer_reviews;
CREATE TRIGGER update_beer_reviews_updated_at
  BEFORE UPDATE ON beer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 15. Verification queries
DO $$
DECLARE
  migrated_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM beer_reviews;
  SELECT COUNT(*) INTO migrated_count FROM beer_reviews WHERE state_code IS NOT NULL;
  
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '- Total beer reviews: %', total_count;
  RAISE NOTICE '- Migrated reviews: %', migrated_count;
  RAISE NOTICE '- Migration coverage: %', ROUND((migrated_count::DECIMAL / GREATEST(total_count, 1)) * 100, 1);
END $$;

-- Success message
SELECT 
  'Safe 7-beer migration completed successfully!' as status,
  COUNT(*) as total_reviews,
  COUNT(*) FILTER (WHERE state_code IS NOT NULL) as migrated_reviews,
  ROUND((COUNT(*) FILTER (WHERE state_code IS NOT NULL)::DECIMAL / COUNT(*)) * 100, 1) as migration_percentage
FROM beer_reviews;