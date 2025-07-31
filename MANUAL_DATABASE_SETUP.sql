-- ==================================================
-- BrewQuest Chronicles Manual Database Setup
-- ==================================================
-- Run this SQL directly in your Supabase SQL Editor
-- This creates all the required tables and initial data
--
-- IMPORTANT: If you get errors about missing columns,
-- run SCHEMA_DIAGNOSTIC.sql first, then SAFE_DATABASE_MIGRATION.sql
-- before running this script.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- Pre-flight Check
-- ==================================================

DO $$
DECLARE
    missing_status_blog boolean := false;
    missing_status_state boolean := false;
BEGIN
    -- Check for common schema issues
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'status'
        ) THEN
            missing_status_blog := true;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'state_progress') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'state_progress' AND column_name = 'status'
        ) THEN
            missing_status_state := true;
        END IF;
    END IF;
    
    IF missing_status_blog OR missing_status_state THEN
        RAISE EXCEPTION 'SCHEMA MISMATCH DETECTED! Missing status columns. Please run SAFE_DATABASE_MIGRATION.sql first.';
    END IF;
    
    RAISE NOTICE 'Pre-flight check passed. Proceeding with setup...';
END $$;

-- ==================================================
-- Core Tables
-- ==================================================

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  state VARCHAR(2) NOT NULL CHECK (LENGTH(state) = 2),
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 50),
  read_time INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  seo_meta_description TEXT,
  seo_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID
);

-- Beer Reviews Table
CREATE TABLE IF NOT EXISTS beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  brewery_name VARCHAR(200) NOT NULL,
  beer_name VARCHAR(200) NOT NULL,
  beer_style VARCHAR(100) NOT NULL,
  abv DECIMAL(4,2) CHECK (abv >= 0 AND abv <= 50),
  ibu INTEGER CHECK (ibu >= 0 AND ibu <= 200),
  rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  tasting_notes TEXT,
  description TEXT,
  unique_feature TEXT,
  brewery_story TEXT,
  brewery_location VARCHAR(200),
  image_url TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  state_code VARCHAR(2) CHECK (LENGTH(state_code) = 2),
  state_name VARCHAR(50),
  week_number INTEGER CHECK (week_number >= 1 AND week_number <= 50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State Progress Table
CREATE TABLE IF NOT EXISTS state_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) UNIQUE NOT NULL CHECK (LENGTH(state_code) = 2),
  state_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('upcoming', 'current', 'completed')) DEFAULT 'upcoming',
  week_number INTEGER UNIQUE NOT NULL CHECK (week_number >= 1 AND week_number <= 50),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  completion_date TIMESTAMP WITH TIME ZONE,
  featured_breweries TEXT[],
  total_breweries INTEGER DEFAULT 0 CHECK (total_breweries >= 0),
  featured_beers_count INTEGER DEFAULT 0 CHECK (featured_beers_count >= 0),
  region VARCHAR(20) NOT NULL CHECK (region IN ('northeast', 'southeast', 'midwest', 'southwest', 'west')),
  description TEXT,
  journey_highlights TEXT[],
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  research_hours INTEGER DEFAULT 0 CHECK (research_hours >= 0),
  capital VARCHAR(100),
  population INTEGER,
  brewery_density DECIMAL(4,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State Analytics Table
CREATE TABLE IF NOT EXISTS state_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap')),
  session_id VARCHAR(255),
  user_agent TEXT,
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  source_page VARCHAR(200),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER,
  metadata JSONB,
  ip_address INET,
  referrer TEXT,
  conversion_event VARCHAR(100),
  user_id UUID
);

-- Brewery Features Table
CREATE TABLE IF NOT EXISTS brewery_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  brewery_name VARCHAR(200) NOT NULL,
  brewery_type VARCHAR(50) CHECK (brewery_type IN ('microbrewery', 'brewpub', 'large', 'regional', 'contract', 'proprietor')),
  city VARCHAR(100) NOT NULL,
  address TEXT,
  website_url TEXT,
  founded_year INTEGER CHECK (founded_year >= 1600 AND founded_year <= EXTRACT(YEAR FROM NOW())),
  specialty_styles TEXT[],
  signature_beers TEXT[],
  brewery_description TEXT,
  why_featured TEXT,
  visit_priority INTEGER CHECK (visit_priority >= 1 AND visit_priority <= 10),
  social_media JSONB,
  awards TEXT[],
  capacity_barrels INTEGER,
  taproom_info JSONB,
  is_active BOOLEAN DEFAULT true,
  featured_week INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Milestones Table
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN (
    'state_completion', 'region_completion', 'brewery_milestone',
    'beer_milestone', 'engagement_milestone', 'technical_milestone',
    'partnership_milestone', 'content_milestone'
  )),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE SET NULL,
  week_number INTEGER CHECK (week_number >= 1 AND week_number <= 50),
  milestone_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metric_value INTEGER,
  metric_unit VARCHAR(50),
  celebration_level VARCHAR(20) CHECK (celebration_level IN ('minor', 'major', 'epic')) DEFAULT 'minor',
  social_media_posted BOOLEAN DEFAULT false,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  metadata JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Indexes for Performance
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_state ON blog_posts(state);
CREATE INDEX IF NOT EXISTS idx_blog_posts_week_number ON blog_posts(week_number);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_blog_post_id ON beer_reviews(blog_post_id);

CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);

CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_id ON state_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_brewery_features_state_code ON brewery_features(state_code);
CREATE INDEX IF NOT EXISTS idx_brewery_features_visit_priority ON brewery_features(visit_priority);
CREATE INDEX IF NOT EXISTS idx_brewery_features_is_active ON brewery_features(is_active);

CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_type ON journey_milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_week_number ON journey_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_is_public ON journey_milestones(is_public);

-- ==================================================
-- Row Level Security
-- ==================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read beer reviews" ON beer_reviews FOR SELECT USING (true);
CREATE POLICY "Public read state progress" ON state_progress FOR SELECT USING (true);
CREATE POLICY "Public read active brewery features" ON brewery_features FOR SELECT USING (is_active = true);
CREATE POLICY "Public read public milestones" ON journey_milestones FOR SELECT USING (is_public = true);
CREATE POLICY "Allow analytics inserts" ON state_analytics FOR INSERT WITH CHECK (true);

-- ==================================================
-- Initial Data - All 50 US States
-- ==================================================

INSERT INTO state_progress (
  state_code, state_name, week_number, region, description, total_breweries, 
  capital, population, brewery_density, research_hours, status
) VALUES 
  ('AL', 'Alabama', 1, 'southeast', 'Heart of Dixie brewing scene emerging with southern charm and innovation.', 45, 'Montgomery', 5024279, 0.9, 12, 'current'),
  ('AK', 'Alaska', 2, 'west', 'Last frontier brewing with glacier water and midnight sun innovation.', 35, 'Juneau', 733391, 4.8, 8, 'upcoming'),
  ('AZ', 'Arizona', 3, 'southwest', 'Desert brewing oasis with year-round outdoor drinking culture.', 123, 'Phoenix', 7151502, 1.7, 15, 'upcoming'),
  ('AR', 'Arkansas', 4, 'southeast', 'Natural State brewing with mountain water and delta hospitality.', 38, 'Little Rock', 3011524, 1.3, 10, 'upcoming'),
  ('CA', 'California', 5, 'west', 'Craft beer capital with hop-forward IPAs and experimental brewing.', 958, 'Sacramento', 39538223, 2.4, 25, 'upcoming'),
  ('CO', 'Colorado', 6, 'west', 'High-altitude brewing with mountain water and outdoor culture.', 425, 'Denver', 5773714, 7.4, 20, 'upcoming'),
  ('CT', 'Connecticut', 7, 'northeast', 'Constitution State brewing with New England tradition and innovation.', 108, 'Hartford', 3605944, 3.0, 12, 'upcoming'),
  ('DE', 'Delaware', 8, 'northeast', 'First State brewing with coastal influence and experimental spirit.', 28, 'Dover', 989948, 2.8, 8, 'upcoming'),
  ('FL', 'Florida', 9, 'southeast', 'Sunshine State brewing with tropical flavors and year-round patio weather.', 327, 'Tallahassee', 21538187, 1.5, 18, 'upcoming'),
  ('GA', 'Georgia', 10, 'southeast', 'Peach State brewing renaissance with Atlanta leading the charge.', 139, 'Atlanta', 10711908, 1.3, 14, 'upcoming'),
  ('HI', 'Hawaii', 11, 'west', 'Aloha State brewing with tropical ingredients and island innovation.', 24, 'Honolulu', 1455271, 1.6, 10, 'upcoming'),
  ('ID', 'Idaho', 12, 'west', 'Gem State brewing with mountain water and outdoor adventure spirit.', 75, 'Boise', 1839106, 4.1, 11, 'upcoming'),
  ('IL', 'Illinois', 13, 'midwest', 'Prairie State brewing with Chicago leading the craft beer revolution.', 296, 'Springfield', 12812508, 2.3, 16, 'upcoming'),
  ('IN', 'Indiana', 14, 'midwest', 'Hoosier State brewing with Midwest hospitality and innovation.', 178, 'Indianapolis', 6785528, 2.6, 13, 'upcoming'),
  ('IA', 'Iowa', 15, 'midwest', 'Hawkeye State brewing with agricultural heritage and craft innovation.', 109, 'Des Moines', 3190369, 3.4, 12, 'upcoming'),
  ('KS', 'Kansas', 16, 'midwest', 'Sunflower State brewing with prairie spirit and agricultural roots.', 54, 'Topeka', 2937880, 1.8, 9, 'upcoming'),
  ('KY', 'Kentucky', 17, 'southeast', 'Bluegrass State brewing heritage meeting bourbon barrel innovation.', 74, 'Frankfort', 4505836, 1.6, 11, 'upcoming'),
  ('LA', 'Louisiana', 18, 'southeast', 'Pelican State brewing with Creole flavors and jazz culture.', 42, 'Baton Rouge', 4657757, 0.9, 10, 'upcoming'),
  ('ME', 'Maine', 19, 'northeast', 'Coastal brewing traditions meet modern innovation in the Pine Tree State.', 155, 'Augusta', 1362359, 11.4, 14, 'upcoming'),
  ('MD', 'Maryland', 20, 'northeast', 'Old Line State brewing with Chesapeake Bay influence and urban innovation.', 104, 'Annapolis', 6177224, 1.7, 12, 'upcoming'),
  ('MA', 'Massachusetts', 21, 'northeast', 'Bay State brewing birthplace of American craft beer revolution.', 204, 'Boston', 7001399, 2.9, 16, 'upcoming'),
  ('MI', 'Michigan', 22, 'midwest', 'Great Lakes State brewing with water abundance and Midwest innovation.', 385, 'Lansing', 10037261, 3.8, 18, 'upcoming'),
  ('MN', 'Minnesota', 23, 'midwest', 'Land of 10,000 Lakes brewing with Scandinavian heritage and innovation.', 196, 'Saint Paul', 5737915, 3.4, 15, 'upcoming'),
  ('MS', 'Mississippi', 24, 'southeast', 'Magnolia State brewing with Delta heritage and southern hospitality.', 18, 'Jackson', 2961279, 0.6, 8, 'upcoming'),
  ('MO', 'Missouri', 25, 'midwest', 'Show-Me State brewing with gateway city innovation and heartland values.', 142, 'Jefferson City', 6196010, 2.3, 13, 'upcoming'),
  ('MT', 'Montana', 26, 'west', 'Big Sky Country brewing with mountain water and frontier spirit.', 76, 'Helena', 1084225, 7.0, 12, 'upcoming'),
  ('NE', 'Nebraska', 27, 'midwest', 'Cornhusker State brewing with agricultural heritage and plains innovation.', 44, 'Lincoln', 1961504, 2.2, 9, 'upcoming'),
  ('NV', 'Nevada', 28, 'west', 'Silver State brewing with desert innovation and 24/7 hospitality.', 56, 'Carson City', 3104614, 1.8, 10, 'upcoming'),
  ('NH', 'New Hampshire', 29, 'northeast', 'Live Free or Die brewing with granite state independence and innovation.', 95, 'Concord', 1377529, 6.9, 11, 'upcoming'),
  ('NJ', 'New Jersey', 30, 'northeast', 'Garden State brewing with shore influence and urban innovation.', 147, 'Trenton', 9288994, 1.6, 13, 'upcoming'),
  ('NM', 'New Mexico', 31, 'southwest', 'Land of Enchantment brewing with high desert innovation and cultural fusion.', 67, 'Santa Fe', 2117522, 3.2, 11, 'upcoming'),
  ('NY', 'New York', 32, 'northeast', 'From NYC''s urban brewing scene to the Finger Lakes wine and beer region.', 469, 'Albany', 20201249, 2.3, 20, 'upcoming'),
  ('NC', 'North Carolina', 33, 'southeast', 'Southern hospitality meets craft beer excellence in the Research Triangle.', 343, 'Raleigh', 10439388, 3.3, 17, 'upcoming'),
  ('ND', 'North Dakota', 34, 'midwest', 'Peace Garden State brewing with prairie resilience and oil boom prosperity.', 23, 'Bismarck', 779094, 3.0, 8, 'upcoming'),
  ('OH', 'Ohio', 35, 'midwest', 'Buckeye State brewing with Great Lakes heritage and heartland innovation.', 315, 'Columbus', 11799448, 2.7, 16, 'upcoming'),
  ('OK', 'Oklahoma', 36, 'southwest', 'Sooner State brewing with frontier spirit and native innovation.', 62, 'Oklahoma City', 3959353, 1.6, 10, 'upcoming'),
  ('OR', 'Oregon', 37, 'west', 'The Pacific Northwest awaits with its renowned hop culture and innovative brewing techniques.', 295, 'Salem', 4237256, 7.0, 18, 'upcoming'),
  ('PA', 'Pennsylvania', 38, 'northeast', 'Keystone State brewing birthplace with historic heritage and modern innovation.', 436, 'Harrisburg', 13002700, 3.4, 19, 'upcoming'),
  ('RI', 'Rhode Island', 39, 'northeast', 'Ocean State brewing with coastal charm and small state big flavor.', 26, 'Providence', 1097379, 2.4, 8, 'upcoming'),
  ('SC', 'South Carolina', 40, 'southeast', 'Palmetto State brewing with lowcountry hospitality and coastal influence.', 68, 'Columbia', 5118425, 1.3, 11, 'upcoming'),
  ('SD', 'South Dakota', 41, 'midwest', 'Mount Rushmore State brewing with frontier spirit and Black Hills water.', 30, 'Pierre', 886667, 3.4, 9, 'upcoming'),
  ('TN', 'Tennessee', 42, 'southeast', 'Volunteer State brewing with country music spirit and bourbon barrel aging.', 115, 'Nashville', 6910840, 1.7, 12, 'upcoming'),
  ('TX', 'Texas', 43, 'southwest', 'Lone Star State brewing with BBQ pairings and big flavors.', 370, 'Austin', 29145505, 1.3, 20, 'upcoming'),
  ('UT', 'Utah', 44, 'west', 'Beehive State brewing with mountain innovation and unique alcohol laws.', 42, 'Salt Lake City', 3271616, 1.3, 10, 'upcoming'),
  ('VT', 'Vermont', 45, 'northeast', 'New England''s craft beer revolution and the birthplace of hazy IPAs.', 74, 'Montpelier', 643077, 11.5, 12, 'upcoming'),
  ('VA', 'Virginia', 46, 'southeast', 'Old Dominion brewing with colonial heritage and modern innovation.', 262, 'Richmond', 8631393, 3.0, 15, 'upcoming'),
  ('WA', 'Washington', 47, 'west', 'Seattle''s coffee culture meets world-class brewing innovation.', 458, 'Olympia', 7693612, 6.0, 19, 'upcoming'),
  ('WV', 'West Virginia', 48, 'southeast', 'Mountain State brewing with Appalachian heritage and mountain water.', 22, 'Charleston', 1793716, 1.2, 8, 'upcoming'),
  ('WI', 'Wisconsin', 49, 'midwest', 'Badger State brewing with German heritage and cheese pairing perfection.', 208, 'Madison', 5893718, 3.5, 14, 'upcoming'),
  ('WY', 'Wyoming', 50, 'west', 'Equality State brewing finale with cowboy spirit and mountain majesty.', 28, 'Cheyenne', 578759, 4.8, 9, 'upcoming')
ON CONFLICT (state_code) DO UPDATE SET
  state_name = EXCLUDED.state_name,
  region = EXCLUDED.region,
  description = EXCLUDED.description,
  total_breweries = EXCLUDED.total_breweries,
  capital = EXCLUDED.capital,
  population = EXCLUDED.population,
  brewery_density = EXCLUDED.brewery_density,
  research_hours = EXCLUDED.research_hours,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ==================================================
-- Alabama Sample Data
-- ==================================================

-- Alabama Beer Reviews (if they don't exist already)
INSERT INTO beer_reviews (
  brewery_name, beer_name, beer_style, abv, ibu, rating,
  tasting_notes, description, day_of_week, state_code, state_name, week_number, image_url
) VALUES 
  (
    'Good People Brewing Company', 'Good People IPA', 'American IPA',
    6.8, 55, 4.0,
    'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
    'Alabama''s #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.',
    1, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Good People IPA.png'
  ),
  (
    'TrimTab Brewing Company', 'TrimTab Paradise Now', 'Berliner Weisse (Fruited)',
    4.2, 8, 4.5,
    'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.',
    'A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham''s innovative brewing scene.',
    4, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/TrimTab Paradise now.png'
  ),
  (
    'Yellowhammer Brewing', 'Ghost Train', 'German-Style Hefeweizen',
    4.8, 15, 4.0,
    'Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.',
    'Huntsville''s signature wheat beer, this traditional German-style hefeweizen showcases authentic Bavarian brewing techniques.',
    2, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Ghost-Train-Yellowhammer.png'
  ),
  (
    'Cahaba Brewing Company', 'Cahaba Oka Uba IPA', 'American IPA',
    7.0, 61, 4.0,
    'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.',
    'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
    3, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png'
  ),
  (
    'Avondale Brewing Company', 'Avondale Miss Fancy''s Tripel', 'Belgian Tripel',
    9.2, 28, 4.0,
    'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
    'A classic Belgian-style tripel brewed in Birmingham''s historic Avondale district with traditional techniques.',
    5, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Avondale Miss Fancy''s Triple.png'
  ),
  (
    'Back Forty Beer Company', 'Snake Handler', 'Double IPA',
    9.2, 99, 4.5,
    'Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.',
    'Gadsden-based brewery''s flagship DIPA, this bold beer showcases aggressive American hop character with Southern attitude.',
    6, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Snake-Handler-Back-Forty.png'
  ),
  (
    'Monday Night Brewing (Birmingham Social Club)', 'Darker Subject Matter', 'Imperial Stout',
    13.9, 45, 4.5,
    'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish with roasted bitterness.',
    'A bold, high-gravity imperial stout from the Atlanta-based brewery''s Birmingham location, showcasing intense roasted complexity.',
    7, 'AL', 'Alabama', 1, '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png'
  )
ON CONFLICT DO NOTHING;

-- Sample Alabama Brewery Features
INSERT INTO brewery_features (
  state_code, brewery_name, brewery_type, city,
  brewery_description, why_featured, visit_priority, is_active, featured_week
) VALUES 
  (
    'AL', 'Good People Brewing Company', 'microbrewery', 'Birmingham',
    'Birmingham''s pioneering craft brewery, known for consistent quality and community focus.',
    'Alabama''s most established and respected craft brewery with statewide distribution.',
    1, true, 1
  ),
  (
    'AL', 'TrimTab Brewing Company', 'microbrewery', 'Birmingham',
    'Known for innovative sour ales and creative experimental brewing in Birmingham''s Avondale district.',
    'Leading Alabama''s sour beer revolution with creative and approachable styles.',
    2, true, 1
  ),
  (
    'AL', 'Yellowhammer Brewing', 'microbrewery', 'Huntsville',
    'Huntsville''s premier craft brewery specializing in traditional German styles and American craft favorites.',
    'Authentic German brewing techniques in the heart of Alabama''s tech corridor.',
    3, true, 1
  )
ON CONFLICT DO NOTHING;

-- Update Alabama state progress with featured breweries
UPDATE state_progress 
SET 
  featured_breweries = ARRAY[
    'Good People Brewing Company',
    'TrimTab Brewing Company', 
    'Yellowhammer Brewing',
    'Cahaba Brewing Company',
    'Avondale Brewing Company',
    'Back Forty Beer Company',
    'Monday Night Brewing'
  ],
  featured_beers_count = 7,
  journey_highlights = ARRAY[
    'Discovered Alabama''s flagship IPA tradition',
    'Explored authentic German brewing techniques in Huntsville',
    'Found innovative sour beer scene in Birmingham',
    'Experienced traditional Belgian styles in the South',
    'Tasted aggressive hop-forward brewing culture'
  ],
  difficulty_rating = 3,
  updated_at = NOW()
WHERE state_code = 'AL';

-- Create launch milestone
INSERT INTO journey_milestones (
  milestone_type, title, description, state_code, week_number,
  metric_value, metric_unit, celebration_level, is_public, metadata
) VALUES (
  'state_completion',
  'BrewQuest Chronicles Launch - Alabama Complete!',
  'Successfully launched the 50-state beer journey with Alabama''s diverse craft beer scene, featuring 7 exceptional beers from 7 different breweries across the Heart of Dixie.',
  'AL', 1, 7, 'beers_reviewed', 'major', true,
  '{"beers_featured": 7, "breweries_visited": 7, "launch_week": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- ==================================================
-- Success Message
-- ==================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'BrewQuest Chronicles database setup complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ All core tables created';
  RAISE NOTICE '✓ All 50 US states populated';
  RAISE NOTICE '✓ Alabama set as current state (week 1)';
  RAISE NOTICE '✓ 7 Alabama beer reviews added';
  RAISE NOTICE '✓ 3 Alabama brewery features added';
  RAISE NOTICE '✓ Row Level Security policies enabled';
  RAISE NOTICE '✓ Performance indexes created';
  RAISE NOTICE '✓ Launch milestone created';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Your blog is ready to go!';
  RAISE NOTICE 'Visit your app to see Alabama content loaded';
  RAISE NOTICE '========================================';
END $$;