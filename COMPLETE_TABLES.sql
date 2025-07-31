-- ==================================================
-- Complete BrewQuest Chronicles Database Tables
-- ==================================================
-- This adds the remaining tables needed for the blog application
-- and establishes proper relationships between existing tables

-- Create state_analytics table for map interactions
CREATE TABLE IF NOT EXISTS state_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code VARCHAR(2),
    interaction_type VARCHAR(20) NOT NULL DEFAULT 'click' CHECK (interaction_type IN ('hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap')),
    session_id VARCHAR(255),
    user_agent TEXT,
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    source_page VARCHAR(200),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER,
    metadata JSONB,
    ip_address INET,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brewery_features table for brewery information
CREATE TABLE IF NOT EXISTS brewery_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code VARCHAR(2),
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
    featured_week INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journey_milestones table for tracking achievements
CREATE TABLE IF NOT EXISTS journey_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_type VARCHAR(50) DEFAULT 'state_completion' CHECK (milestone_type IN ('state_completion', 'region_completion', 'brewery_milestone', 'beer_milestone', 'engagement_milestone', 'technical_milestone', 'partnership_milestone', 'content_milestone')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    state_code VARCHAR(2),
    week_number INTEGER CHECK (week_number >= 1 AND week_number <= 50),
    milestone_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metric_value INTEGER,
    metric_unit VARCHAR(50),
    celebration_level VARCHAR(20) DEFAULT 'minor' CHECK (celebration_level IN ('minor', 'major', 'epic')),
    social_media_posted BOOLEAN DEFAULT false,
    blog_post_id UUID,
    metadata JSONB,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables for proper relationships
DO $$
BEGIN
    -- Add columns to beer_reviews for better state relationships
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beer_reviews' AND column_name = 'state_code') THEN
        ALTER TABLE beer_reviews ADD COLUMN state_code VARCHAR(2);
        -- Update existing rows to have AL state code
        UPDATE beer_reviews SET state_code = 'AL' WHERE state_code IS NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beer_reviews' AND column_name = 'state_name') THEN
        ALTER TABLE beer_reviews ADD COLUMN state_name VARCHAR(50);
        -- Update existing rows to have Alabama state name
        UPDATE beer_reviews SET state_name = 'Alabama' WHERE state_name IS NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beer_reviews' AND column_name = 'week_number') THEN
        ALTER TABLE beer_reviews ADD COLUMN week_number INTEGER;
        -- Update existing rows to be week 1
        UPDATE beer_reviews SET week_number = 1 WHERE week_number IS NULL;
    END IF;
    
    -- Add blog_post_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beer_reviews' AND column_name = 'blog_post_id') THEN
        ALTER TABLE beer_reviews ADD COLUMN blog_post_id UUID;
    END IF;

    RAISE NOTICE 'Added missing columns to beer_reviews';

END $$;

-- Now add the foreign key constraints (after columns exist)
DO $$
BEGIN
    -- Add foreign key from state_analytics to state_progress
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_state_analytics_state_code' 
        AND table_name = 'state_analytics'
    ) THEN
        ALTER TABLE state_analytics 
        ADD CONSTRAINT fk_state_analytics_state_code 
        FOREIGN KEY (state_code) REFERENCES state_progress(state_code) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key: state_analytics -> state_progress';
    END IF;

    -- Add foreign key from brewery_features to state_progress
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_brewery_features_state_code' 
        AND table_name = 'brewery_features'
    ) THEN
        ALTER TABLE brewery_features 
        ADD CONSTRAINT fk_brewery_features_state_code 
        FOREIGN KEY (state_code) REFERENCES state_progress(state_code) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key: brewery_features -> state_progress';
    END IF;

    -- Add foreign key from journey_milestones to state_progress
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_journey_milestones_state_code' 
        AND table_name = 'journey_milestones'
    ) THEN
        ALTER TABLE journey_milestones 
        ADD CONSTRAINT fk_journey_milestones_state_code 
        FOREIGN KEY (state_code) REFERENCES state_progress(state_code) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key: journey_milestones -> state_progress';
    END IF;

    -- Add foreign key from beer_reviews to state_progress
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_beer_reviews_state_code' 
        AND table_name = 'beer_reviews'
    ) THEN
        ALTER TABLE beer_reviews 
        ADD CONSTRAINT fk_beer_reviews_state_code 
        FOREIGN KEY (state_code) REFERENCES state_progress(state_code) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key: beer_reviews -> state_progress';
    END IF;

END $$;

-- Add some sample brewery data for Alabama
INSERT INTO brewery_features (
    state_code, brewery_name, city, brewery_type, visit_priority,
    brewery_description, why_featured, specialty_styles, signature_beers
) VALUES 
    ('AL', 'Good People Brewing Company', 'Birmingham', 'microbrewery', 1,
     'Founded in 2008, Good People Brewing is Alabama''s largest craft brewery known for their flagship IPA.',
     'Alabama''s most recognizable craft brewery with statewide distribution',
     ARRAY['IPA', 'Pale Ale', 'Brown Ale'], ARRAY['Good People IPA']),
    ('AL', 'Cahaba Brewing Company', 'Birmingham', 'microbrewery', 2,
     'Named after the Cahaba River, this brewery focuses on approachable, drinkable beers.',
     'Known for their river-themed branding and outdoor lifestyle appeal',
     ARRAY['American IPA', 'Dry Stout'], ARRAY['Cahaba Oka Uba IPA']),
    ('AL', 'TrimTab Brewing Company', 'Birmingham', 'microbrewery', 3,
     'Known for innovative brewing techniques and exceptional sour beers.',
     'Leaders in experimental brewing and sour beer production in Alabama',
     ARRAY['Berliner Weisse', 'Fruited Sour'], ARRAY['TrimTab Paradise Now'])
ON CONFLICT DO NOTHING;

-- Add a milestone for Alabama launch
INSERT INTO journey_milestones (
    milestone_type, title, description, state_code, week_number,
    celebration_level, is_public
) VALUES (
    'state_completion', 'Alabama Craft Beer Journey Launched!',
    'Successfully launched the BrewQuest Chronicles with Alabama as our first featured state.',
    'AL', 1, 'major', true
) ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_brewery_features_state_code ON brewery_features(state_code);
CREATE INDEX IF NOT EXISTS idx_brewery_features_visit_priority ON brewery_features(visit_priority);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_state_code ON journey_milestones(state_code);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_week_number ON journey_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);

-- Enable RLS on new tables
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
DROP POLICY IF EXISTS "Public read state analytics" ON state_analytics;
CREATE POLICY "Public read state analytics" ON state_analytics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read brewery features" ON brewery_features;
CREATE POLICY "Public read brewery features" ON brewery_features FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read public milestones" ON journey_milestones;
CREATE POLICY "Public read public milestones" ON journey_milestones FOR SELECT USING (is_public = true);

-- Allow analytics inserts (for tracking user interactions)
DROP POLICY IF EXISTS "Allow analytics inserts" ON state_analytics;
CREATE POLICY "Allow analytics inserts" ON state_analytics FOR INSERT WITH CHECK (true);

RAISE NOTICE '======================================';
RAISE NOTICE 'DATABASE COMPLETION SUCCESSFUL!';
RAISE NOTICE '======================================';
RAISE NOTICE '✓ Created missing tables (state_analytics, brewery_features, journey_milestones)';
RAISE NOTICE '✓ Added foreign key relationships to connect tables';
RAISE NOTICE '✓ Updated beer_reviews with state information';
RAISE NOTICE '✓ Added sample Alabama brewery data';
RAISE NOTICE '✓ Created performance indexes';
RAISE NOTICE '✓ Set up Row Level Security policies';
RAISE NOTICE '======================================';
RAISE NOTICE 'Your database is now fully connected and ready!';
RAISE NOTICE '======================================';