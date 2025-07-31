-- Complete Hop Harrison Database Schema
-- Creates all tables from scratch to support the 7-beer weekly structure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  state_code VARCHAR(2),
  week_number INTEGER,
  content_type VARCHAR(20) CHECK (content_type IN ('state_overview', 'beer_review', 'general')),
  featured_image_url TEXT,
  seo_title VARCHAR(60),
  seo_meta_description VARCHAR(160),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_date DATE,
  scheduled_time TIME,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. BEER REVIEWS TABLE (Updated for 7 beers)
-- =====================================================
CREATE TABLE IF NOT EXISTS beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL,
  week_number INTEGER NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  blog_post_id UUID REFERENCES blog_posts(id),
  brewery_name VARCHAR(255) NOT NULL,
  brewery_website TEXT,
  beer_name VARCHAR(255) NOT NULL,
  beer_style VARCHAR(100) NOT NULL,
  abv DECIMAL(4,2),
  ibu INTEGER,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
  description TEXT,
  unique_feature TEXT,
  tasting_notes TEXT,
  food_pairings TEXT[],
  availability VARCHAR(100),
  price_range VARCHAR(50),
  brewery_location VARCHAR(255),
  brewery_founded INTEGER,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_date DATE,
  scheduled_time TIME,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. STATE PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS state_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) UNIQUE NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'current', 'completed')),
  week_number INTEGER UNIQUE,
  blog_post_id UUID REFERENCES blog_posts(id),
  completion_date DATE,
  featured_breweries TEXT[],
  total_breweries INTEGER DEFAULT 0,
  featured_beers_count INTEGER DEFAULT 7, -- Updated to 7
  region VARCHAR(50),
  description TEXT,
  journey_highlights TEXT[],
  difficulty_rating DECIMAL(3,1),
  research_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SOCIAL POSTS TABLE (Updated for 7 beers)
-- =====================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok')),
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('state_post', 'beer_review', 'general')),
  blog_post_id UUID REFERENCES blog_posts(id),
  beer_review_id UUID REFERENCES beer_reviews(id),
  state_code VARCHAR(2),
  week_number INTEGER,
  beer_day INTEGER CHECK (beer_day >= 1 AND beer_day <= 7), -- New field for 7-beer structure
  post_text TEXT NOT NULL,
  hashtags TEXT[],
  media_urls TEXT[],
  link_url TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  engagement_stats JSONB,
  platform_post_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CONTENT SCHEDULE TABLE (New for 7-beer workflow)
-- =====================================================
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
  beer_day INTEGER CHECK (beer_day >= 1 AND beer_day <= 7), -- For beer reviews (1-7)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_code, week_number, content_type, beer_day)
);

-- =====================================================
-- 6. NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'unsubscribed')),
  subscription_date DATE DEFAULT CURRENT_DATE,
  preferences JSONB,
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. PAGE ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(255),
  user_id UUID,
  session_id VARCHAR(100),
  event_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100), 
  utm_campaign VARCHAR(100),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  duration_seconds INTEGER,
  metadata JSONB
);

-- =====================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_state_week ON blog_posts(state_code, week_number);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Beer reviews indexes (Updated for 7-beer structure)
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day ON beer_reviews(state_code, week_number, day_of_week);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_status ON beer_reviews(status, published_at);

-- State progress indexes
CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week ON state_progress(week_number);

-- Social posts indexes (Updated for 7-beer structure)  
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform, status);
CREATE INDEX IF NOT EXISTS idx_social_posts_schedule ON social_posts(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_social_posts_beer_day ON social_posts(state_code, week_number, beer_day, platform);

-- Content schedule indexes
CREATE INDEX IF NOT EXISTS idx_content_schedule_date ON content_schedule(scheduled_date, scheduled_time, status);
CREATE INDEX IF NOT EXISTS idx_content_schedule_state ON content_schedule(state_code, week_number);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_page_analytics_timestamp ON page_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page ON page_analytics(page_path);

-- =====================================================
-- 9. FUNCTIONS FOR 7-BEER WORKFLOW
-- =====================================================

-- Function to generate weekly content schedule
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

-- Function to validate weekly content (Updated for 7 beers)
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

-- Function to get journey statistics (Updated for 350 beers)
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

-- =====================================================
-- 10. SAMPLE DATA - ALABAMA WEEK 1 (7 BEERS)
-- =====================================================

-- Insert Alabama state progress
INSERT INTO state_progress (
  state_code, state_name, status, week_number, region, 
  description, total_breweries, featured_beers_count
) VALUES (
  'AL', 'Alabama', 'current', 1, 'Southeast',
  'Alabama''s craft beer scene has exploded in recent years, with innovative breweries across Birmingham, Huntsville, and beyond creating exceptional beers that showcase Southern hospitality and creativity.',
  25, 7
) ON CONFLICT (state_code) DO UPDATE SET
  status = EXCLUDED.status,
  week_number = EXCLUDED.week_number,
  description = EXCLUDED.description,
  total_breweries = EXCLUDED.total_breweries,
  featured_beers_count = EXCLUDED.featured_beers_count;

-- Insert Alabama beer reviews (7 beers for Week 1)
INSERT INTO beer_reviews (
  state_code, week_number, day_of_week, brewery_name, brewery_website, beer_name, 
  beer_style, abv, ibu, rating, description, unique_feature, brewery_location
) VALUES 
('AL', 1, 1, 'Good People Brewing', 'https://goodpeoplebrewing.com', 'Snake Handler Double IPA', 'Double IPA', 9.2, 85, 4.5, 'Bold and hoppy with citrus notes and a warming alcohol presence', 'Locally sourced Alabama hops and aggressive dry-hopping', 'Birmingham, AL'),
('AL', 1, 2, 'Trim Tab Brewing', 'https://trimtabbrewing.com', 'Paradise Now', 'Gose', 4.8, 8, 4.2, 'Refreshing sour with tropical fruits and a perfect salt balance', 'Cucumber and lime infusion with sea salt', 'Birmingham, AL'),
('AL', 1, 3, 'Cahaba Brewing', 'https://cahababrewing.com', 'Oka Uba IPA', 'IPA', 6.8, 65, 4.0, 'Balanced IPA with Alabama character and regional hop character', 'Named after Creek Indian word meaning "water above"', 'Birmingham, AL'),
('AL', 1, 4, 'Avondale Brewing', 'https://avondalebrewing.com', 'Miss Fancy''s Tripel', 'Belgian Tripel', 9.0, 25, 4.6, 'Complex Belgian-style ale with fruity esters and spicy phenols', 'Birmingham-brewed Belgian tradition with local twist', 'Birmingham, AL'),
('AL', 1, 5, 'Yellowhammer Brewing', 'https://yellowhammerbrewery.com', 'Cliff Hanger Pale Ale', 'Pale Ale', 5.2, 40, 3.8, 'Easy-drinking pale ale with bright hop character', 'Huntsville space city inspiration and rocket-themed branding', 'Huntsville, AL'),
('AL', 1, 6, 'Back Forty Beer Co.', 'https://backfortybeer.com', 'Naked Pig Pale Ale', 'Pale Ale', 4.5, 35, 4.1, 'Light and approachable with subtle hop character', 'Alabama agricultural roots and farm-to-glass philosophy', 'Gadsden, AL'),
('AL', 1, 7, 'Druid City Brewing', 'https://druidcitybrewing.com', 'BlackWarrior Porter', 'Porter', 5.8, 30, 4.3, 'Rich and smooth porter with chocolate and coffee notes', 'Named after Tuscaloosa''s Black Warrior River heritage', 'Tuscaloosa, AL')
ON CONFLICT DO NOTHING;

-- Generate content schedule for Alabama Week 1
INSERT INTO content_schedule (
  state_code, week_number, content_type, scheduled_date, scheduled_time, beer_day
)
SELECT 
  'AL', 1, content_type, scheduled_date, scheduled_time, beer_day
FROM generate_weekly_schedule('AL', 1, '2025-02-03'::DATE)
ON CONFLICT (state_code, week_number, content_type, beer_day) DO NOTHING;

-- =====================================================
-- 11. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_beer_reviews_updated_at ON beer_reviews;
CREATE TRIGGER update_beer_reviews_updated_at
    BEFORE UPDATE ON beer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_state_progress_updated_at ON state_progress;
CREATE TRIGGER update_state_progress_updated_at
    BEFORE UPDATE ON state_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. ROW LEVEL SECURITY (Basic Setup)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Create basic policies (you can customize these)
CREATE POLICY "Allow public read access to blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to beer reviews" ON beer_reviews
    FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to state progress" ON state_progress
    FOR SELECT USING (true);

-- Success message
SELECT 'Complete 7-beer database schema created successfully!' as status,
       'Tables: blog_posts, beer_reviews (7/week), state_progress, social_posts, content_schedule, newsletter_subscribers, page_analytics' as tables_created,
       'Sample data: Alabama Week 1 with 7 beer reviews ready for testing' as sample_data;