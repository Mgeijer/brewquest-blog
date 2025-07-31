-- Database Schema Update: 7 Beers Per Week Structure
-- Updates the content structure to support 1 weekly post + 7 beer reviews per week

-- 1. Update beer_reviews table to support 7 beers per week
ALTER TABLE beer_reviews 
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7);

-- Add constraint to ensure exactly 7 beers per state per week
CREATE OR REPLACE FUNCTION validate_weekly_beer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM beer_reviews 
      WHERE state_code = NEW.state_code 
        AND week_number = NEW.week_number) >= 7 THEN
    RAISE EXCEPTION 'Maximum 7 beer reviews per state per week exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_weekly_beer_limit ON beer_reviews;
CREATE TRIGGER check_weekly_beer_limit
  BEFORE INSERT ON beer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION validate_weekly_beer_count();

-- 2. Update social_posts table for 7 beers per week
ALTER TABLE social_posts 
ADD COLUMN IF NOT EXISTS beer_day INTEGER CHECK (beer_day >= 1 AND beer_day <= 7);

-- 3. Update content scheduling to handle Monday dual publishing
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
  beer_day INTEGER, -- For beer reviews (1-7)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_code, week_number, content_type, beer_day)
);

-- 4. Create function to generate weekly content schedule
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

-- 5. Update statistics functions for 7 beers per week
CREATE OR REPLACE FUNCTION get_journey_statistics()
RETURNS JSON AS $$
DECLARE
  total_states INTEGER := 50;
  total_expected_beers INTEGER := 350; -- 7 beers × 50 states
  completed_states INTEGER;
  published_beers INTEGER;
  result JSON;
BEGIN
  -- Count completed states
  SELECT COUNT(*) INTO completed_states
  FROM state_progress 
  WHERE status = 'completed';
  
  -- Count published beer reviews
  SELECT COUNT(*) INTO published_beers
  FROM beer_reviews 
  WHERE published_at IS NOT NULL;
  
  -- Calculate progress percentages
  result := json_build_object(
    'total_states', total_states,
    'completed_states', completed_states,
    'states_progress_percent', ROUND((completed_states::DECIMAL / total_states) * 100, 1),
    'total_expected_beers', total_expected_beers,
    'published_beers', published_beers,
    'beers_progress_percent', ROUND((published_beers::DECIMAL / total_expected_beers) * 100, 1),
    'average_beers_per_state', ROUND(published_beers::DECIMAL / GREATEST(completed_states, 1), 1),
    'estimated_completion_date', (
      SELECT DATE(MIN(scheduled_date) + INTERVAL '49 weeks')
      FROM content_schedule 
      WHERE content_type = 'state_post'
      LIMIT 1
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to validate weekly content completeness
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
  WHERE state_code = p_state_code 
    AND week_number = p_week_number 
    AND content_type = 'state_overview';
  
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

-- 7. Update social media generation for 7 beers
CREATE OR REPLACE FUNCTION generate_weekly_social_posts(
  p_state_code VARCHAR(2),
  p_week_number INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  beer_record RECORD;
  social_post_count INTEGER := 0;
  platforms TEXT[] := ARRAY['instagram', 'twitter', 'facebook', 'linkedin'];
  platform TEXT;
BEGIN
  -- Generate social posts for all 7 beer reviews
  FOR beer_record IN 
    SELECT * FROM beer_reviews 
    WHERE state_code = p_state_code 
      AND week_number = p_week_number 
    ORDER BY day_of_week
  LOOP
    -- Create posts for each platform
    FOREACH platform IN ARRAY platforms
    LOOP
      INSERT INTO social_posts (
        platform,
        content_type,
        beer_review_id,
        state_code,
        week_number,
        beer_day,
        post_text,
        hashtags,
        scheduled_date,
        status
      ) VALUES (
        platform,
        'beer_review',
        beer_record.id,
        p_state_code,
        p_week_number,
        beer_record.day_of_week,
        format('🍺 Day %s: Exploring %s from %s! %s #CraftBeer #%sState #BeerJourney', 
               beer_record.day_of_week,
               beer_record.beer_name,
               beer_record.brewery_name,
               beer_record.unique_feature,
               p_state_code),
        ARRAY['craftbeer', 'beer', 'brewery', p_state_code || 'beer'],
        CURRENT_DATE + (beer_record.day_of_week - 1),
        'scheduled'
      );
      
      social_post_count := social_post_count + 1;
    END LOOP;
  END LOOP;
  
  RETURN social_post_count;
END;
$$ LANGUAGE plpgsql;

-- 8. Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day 
ON beer_reviews(state_code, week_number, day_of_week);

CREATE INDEX IF NOT EXISTS idx_content_schedule_date 
ON content_schedule(scheduled_date, scheduled_time, status);

CREATE INDEX IF NOT EXISTS idx_social_posts_beer_day 
ON social_posts(state_code, week_number, beer_day, platform);

-- 9. Sample data for testing (Alabama - Week 1)
DO $$
BEGIN
  -- Generate content schedule for Alabama (Week 1)
  INSERT INTO content_schedule (
    state_code, week_number, content_type, scheduled_date, scheduled_time, beer_day
  )
  SELECT 
    'AL', 1, content_type, scheduled_date, scheduled_time, beer_day
  FROM generate_weekly_schedule('AL', 1, '2025-02-03'::DATE);
  
  -- Insert sample beer reviews for Alabama (7 beers)
  INSERT INTO beer_reviews (
    state_code, week_number, day_of_week, brewery_name, beer_name, 
    beer_style, abv, ibu, rating, description, unique_feature
  ) VALUES 
  ('AL', 1, 1, 'Good People Brewing', 'Snake Handler Double IPA', 'Double IPA', 9.2, 85, 4.5, 'Bold and hoppy with citrus notes', 'Locally sourced Alabama hops'),
  ('AL', 1, 2, 'Trim Tab Brewing', 'Paradise Now', 'Gose', 4.8, 8, 4.2, 'Refreshing sour with tropical fruits', 'Cucumber and lime infusion'),
  ('AL', 1, 3, 'Cahaba Brewing', 'Oka Uba IPA', 'IPA', 6.8, 65, 4.0, 'Balanced IPA with Alabama character', 'Named after Creek Indian word'),
  ('AL', 1, 4, 'Avondale Brewing', 'Miss Fancy\'s Tripel', 'Belgian Tripel', 9.0, 25, 4.6, 'Complex Belgian-style ale', 'Birmingham-brewed Belgian tradition'),
  ('AL', 1, 5, 'Yellowhammer Brewing', 'Cliff Hanger Pale Ale', 'Pale Ale', 5.2, 40, 3.8, 'Easy-drinking pale ale', 'Huntsville space city inspiration'),
  ('AL', 1, 6, 'Back Forty Beer Co.', 'Naked Pig Pale Ale', 'Pale Ale', 4.5, 35, 4.1, 'Light and approachable', 'Alabama agricultural roots'),
  ('AL', 1, 7, 'Druid City Brewing', 'BlackWarrior Porter', 'Porter', 5.8, 30, 4.3, 'Rich and smooth porter', 'Tuscaloosa river heritage');
  
EXCEPTION WHEN OTHERS THEN
  -- Ignore if data already exists
  NULL;
END $$;

-- Success message
SELECT '7-beers-per-week schema update completed successfully!' as status;