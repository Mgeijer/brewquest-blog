-- ==================================================
-- BrewQuest Chronicles Safe Database Migration
-- ==================================================
-- This script safely upgrades any existing database structure
-- Run this AFTER the diagnostic script if issues were found

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- Safe Table Creation and Column Addition Functions
-- ==================================================

-- Function to safely add a column if it doesn't exist
CREATE OR REPLACE FUNCTION safe_add_column(
    table_name TEXT,
    column_name TEXT,
    column_definition TEXT
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = safe_add_column.table_name 
        AND column_name = safe_add_column.column_name
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', table_name, column_name, column_definition);
        RAISE NOTICE 'Added column %.% with definition: %', table_name, column_name, column_definition;
    ELSE
        RAISE NOTICE 'Column %.% already exists, skipping', table_name, column_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- Safe Blog Posts Table Migration
-- ==================================================

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('blog_posts', 'excerpt', 'TEXT');
SELECT safe_add_column('blog_posts', 'content', 'TEXT NOT NULL DEFAULT ''''');
SELECT safe_add_column('blog_posts', 'featured_image_url', 'TEXT');
SELECT safe_add_column('blog_posts', 'state', 'VARCHAR(2) CHECK (LENGTH(state) = 2)');
SELECT safe_add_column('blog_posts', 'week_number', 'INTEGER CHECK (week_number >= 1 AND week_number <= 50)');
SELECT safe_add_column('blog_posts', 'read_time', 'INTEGER DEFAULT 0');
SELECT safe_add_column('blog_posts', 'published_at', 'TIMESTAMP WITH TIME ZONE');
SELECT safe_add_column('blog_posts', 'seo_meta_description', 'TEXT');
SELECT safe_add_column('blog_posts', 'seo_keywords', 'TEXT[]');
SELECT safe_add_column('blog_posts', 'view_count', 'INTEGER DEFAULT 0');
SELECT safe_add_column('blog_posts', 'is_featured', 'BOOLEAN DEFAULT false');
SELECT safe_add_column('blog_posts', 'status', 'VARCHAR(20) DEFAULT ''draft'' CHECK (status IN (''draft'', ''published'', ''archived''))');
SELECT safe_add_column('blog_posts', 'author_id', 'UUID');

-- ==================================================
-- Safe Beer Reviews Table Migration
-- ==================================================

CREATE TABLE IF NOT EXISTS beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('beer_reviews', 'blog_post_id', 'UUID REFERENCES blog_posts(id) ON DELETE CASCADE');
SELECT safe_add_column('beer_reviews', 'brewery_name', 'VARCHAR(200) NOT NULL DEFAULT ''''');
SELECT safe_add_column('beer_reviews', 'beer_name', 'VARCHAR(200) NOT NULL DEFAULT ''''');
SELECT safe_add_column('beer_reviews', 'beer_style', 'VARCHAR(100) NOT NULL DEFAULT ''''');
SELECT safe_add_column('beer_reviews', 'abv', 'DECIMAL(4,2) CHECK (abv >= 0 AND abv <= 50)');
SELECT safe_add_column('beer_reviews', 'ibu', 'INTEGER CHECK (ibu >= 0 AND ibu <= 200)');
SELECT safe_add_column('beer_reviews', 'rating', 'DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0)');
SELECT safe_add_column('beer_reviews', 'tasting_notes', 'TEXT');
SELECT safe_add_column('beer_reviews', 'description', 'TEXT');
SELECT safe_add_column('beer_reviews', 'unique_feature', 'TEXT');
SELECT safe_add_column('beer_reviews', 'brewery_story', 'TEXT');
SELECT safe_add_column('beer_reviews', 'brewery_location', 'VARCHAR(200)');
SELECT safe_add_column('beer_reviews', 'image_url', 'TEXT');
SELECT safe_add_column('beer_reviews', 'day_of_week', 'INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7)');
SELECT safe_add_column('beer_reviews', 'state_code', 'VARCHAR(2) CHECK (LENGTH(state_code) = 2)');
SELECT safe_add_column('beer_reviews', 'state_name', 'VARCHAR(50)');
SELECT safe_add_column('beer_reviews', 'week_number', 'INTEGER CHECK (week_number >= 1 AND week_number <= 50)');

-- ==================================================
-- Safe State Progress Table Migration
-- ==================================================

CREATE TABLE IF NOT EXISTS state_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) UNIQUE NOT NULL CHECK (LENGTH(state_code) = 2),
  state_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('state_progress', 'status', 'VARCHAR(20) CHECK (status IN (''upcoming'', ''current'', ''completed'')) DEFAULT ''upcoming''');
SELECT safe_add_column('state_progress', 'week_number', 'INTEGER UNIQUE CHECK (week_number >= 1 AND week_number <= 50)');
SELECT safe_add_column('state_progress', 'blog_post_id', 'UUID REFERENCES blog_posts(id) ON DELETE SET NULL');
SELECT safe_add_column('state_progress', 'completion_date', 'TIMESTAMP WITH TIME ZONE');
SELECT safe_add_column('state_progress', 'featured_breweries', 'TEXT[]');
SELECT safe_add_column('state_progress', 'total_breweries', 'INTEGER DEFAULT 0 CHECK (total_breweries >= 0)');
SELECT safe_add_column('state_progress', 'featured_beers_count', 'INTEGER DEFAULT 0 CHECK (featured_beers_count >= 0)');
SELECT safe_add_column('state_progress', 'region', 'VARCHAR(20) CHECK (region IN (''northeast'', ''southeast'', ''midwest'', ''southwest'', ''west''))');
SELECT safe_add_column('state_progress', 'description', 'TEXT');
SELECT safe_add_column('state_progress', 'journey_highlights', 'TEXT[]');
SELECT safe_add_column('state_progress', 'difficulty_rating', 'INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5)');
SELECT safe_add_column('state_progress', 'research_hours', 'INTEGER DEFAULT 0 CHECK (research_hours >= 0)');
SELECT safe_add_column('state_progress', 'capital', 'VARCHAR(100)');
SELECT safe_add_column('state_progress', 'population', 'INTEGER');
SELECT safe_add_column('state_progress', 'brewery_density', 'DECIMAL(4,1)');

-- ==================================================
-- Safe State Analytics Table Migration
-- ==================================================

CREATE TABLE IF NOT EXISTS state_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('state_analytics', 'state_code', 'VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE');
SELECT safe_add_column('state_analytics', 'interaction_type', 'VARCHAR(20) NOT NULL CHECK (interaction_type IN (''hover'', ''click'', ''navigation'', ''tooltip_view'', ''mobile_tap'')) DEFAULT ''click''');
SELECT safe_add_column('state_analytics', 'session_id', 'VARCHAR(255)');
SELECT safe_add_column('state_analytics', 'user_agent', 'TEXT');
SELECT safe_add_column('state_analytics', 'device_type', 'VARCHAR(20) CHECK (device_type IN (''desktop'', ''mobile'', ''tablet'', ''unknown''))');
SELECT safe_add_column('state_analytics', 'source_page', 'VARCHAR(200)');
SELECT safe_add_column('state_analytics', 'duration_ms', 'INTEGER');
SELECT safe_add_column('state_analytics', 'metadata', 'JSONB');
SELECT safe_add_column('state_analytics', 'ip_address', 'INET');
SELECT safe_add_column('state_analytics', 'referrer', 'TEXT');
SELECT safe_add_column('state_analytics', 'conversion_event', 'VARCHAR(100)');
SELECT safe_add_column('state_analytics', 'user_id', 'UUID');

-- ==================================================
-- Safe Brewery Features Table Migration
-- ==================================================

CREATE TABLE IF NOT EXISTS brewery_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brewery_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('brewery_features', 'state_code', 'VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE');
SELECT safe_add_column('brewery_features', 'brewery_type', 'VARCHAR(50) CHECK (brewery_type IN (''microbrewery'', ''brewpub'', ''large'', ''regional'', ''contract'', ''proprietor''))');
SELECT safe_add_column('brewery_features', 'address', 'TEXT');
SELECT safe_add_column('brewery_features', 'website_url', 'TEXT');
SELECT safe_add_column('brewery_features', 'founded_year', 'INTEGER CHECK (founded_year >= 1600 AND founded_year <= EXTRACT(YEAR FROM NOW()))');
SELECT safe_add_column('brewery_features', 'specialty_styles', 'TEXT[]');
SELECT safe_add_column('brewery_features', 'signature_beers', 'TEXT[]');
SELECT safe_add_column('brewery_features', 'brewery_description', 'TEXT');
SELECT safe_add_column('brewery_features', 'why_featured', 'TEXT');
SELECT safe_add_column('brewery_features', 'visit_priority', 'INTEGER CHECK (visit_priority >= 1 AND visit_priority <= 10)');
SELECT safe_add_column('brewery_features', 'social_media', 'JSONB');
SELECT safe_add_column('brewery_features', 'awards', 'TEXT[]');
SELECT safe_add_column('brewery_features', 'capacity_barrels', 'INTEGER');
SELECT safe_add_column('brewery_features', 'taproom_info', 'JSONB');
SELECT safe_add_column('brewery_features', 'featured_week', 'INTEGER');

-- ==================================================
-- Safe Journey Milestones Table Migration
-- ==================================================

CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  milestone_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns safely
SELECT safe_add_column('journey_milestones', 'milestone_type', 'VARCHAR(50) CHECK (milestone_type IN (''state_completion'', ''region_completion'', ''brewery_milestone'', ''beer_milestone'', ''engagement_milestone'', ''technical_milestone'', ''partnership_milestone'', ''content_milestone'')) DEFAULT ''state_completion''');
SELECT safe_add_column('journey_milestones', 'state_code', 'VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE SET NULL');
SELECT safe_add_column('journey_milestones', 'week_number', 'INTEGER CHECK (week_number >= 1 AND week_number <= 50)');
SELECT safe_add_column('journey_milestones', 'metric_value', 'INTEGER');
SELECT safe_add_column('journey_milestones', 'metric_unit', 'VARCHAR(50)');
SELECT safe_add_column('journey_milestones', 'celebration_level', 'VARCHAR(20) CHECK (celebration_level IN (''minor'', ''major'', ''epic'')) DEFAULT ''minor''');
SELECT safe_add_column('journey_milestones', 'social_media_posted', 'BOOLEAN DEFAULT false');
SELECT safe_add_column('journey_milestones', 'blog_post_id', 'UUID REFERENCES blog_posts(id) ON DELETE SET NULL');
SELECT safe_add_column('journey_milestones', 'metadata', 'JSONB');

-- ==================================================
-- Fix NOT NULL Constraints Safely
-- ==================================================

-- Function to safely update NOT NULL constraints
CREATE OR REPLACE FUNCTION safe_set_not_null(
    table_name TEXT,
    column_name TEXT,
    default_value TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- First update any NULL values if a default is provided
    IF default_value IS NOT NULL THEN
        EXECUTE format('UPDATE %I SET %I = %L WHERE %I IS NULL', 
            table_name, column_name, default_value, column_name);
    END IF;
    
    -- Then set NOT NULL constraint
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I SET NOT NULL', table_name, column_name);
    RAISE NOTICE 'Set column %.% as NOT NULL', table_name, column_name;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not set %.% as NOT NULL: %', table_name, column_name, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Apply NOT NULL constraints where needed (with safe defaults)
SELECT safe_set_not_null('blog_posts', 'content', '');
SELECT safe_set_not_null('beer_reviews', 'brewery_name', 'Unknown Brewery');
SELECT safe_set_not_null('beer_reviews', 'beer_name', 'Unknown Beer');
SELECT safe_set_not_null('beer_reviews', 'beer_style', 'Unknown Style');
SELECT safe_set_not_null('state_progress', 'region', 'unknown');
SELECT safe_set_not_null('journey_milestones', 'milestone_type', 'state_completion');

-- ==================================================
-- Create Indexes Safely
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
-- Apply Row Level Security Safely
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read beer reviews" ON beer_reviews;
DROP POLICY IF EXISTS "Public read state progress" ON state_progress;
DROP POLICY IF EXISTS "Public read active brewery features" ON brewery_features;
DROP POLICY IF EXISTS "Public read public milestones" ON journey_milestones;
DROP POLICY IF EXISTS "Allow analytics inserts" ON state_analytics;

-- Create policies
CREATE POLICY "Public read published blog posts" ON blog_posts FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Public read beer reviews" ON beer_reviews FOR SELECT USING (true);
CREATE POLICY "Public read state progress" ON state_progress FOR SELECT USING (true);
CREATE POLICY "Public read active brewery features" ON brewery_features FOR SELECT USING (is_active = true OR is_active IS NULL);
CREATE POLICY "Public read public milestones" ON journey_milestones FOR SELECT USING (is_public = true OR is_public IS NULL);
CREATE POLICY "Allow analytics inserts" ON state_analytics FOR INSERT WITH CHECK (true);

-- ==================================================
-- Clean up helper functions
-- ==================================================

DROP FUNCTION IF EXISTS safe_add_column(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS safe_set_not_null(TEXT, TEXT, TEXT);

-- ==================================================
-- Final Success Message
-- ==================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SAFE DATABASE MIGRATION COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ All tables safely created/updated';
    RAISE NOTICE '✓ Missing columns added safely';
    RAISE NOTICE '✓ Constraints applied where possible';
    RAISE NOTICE '✓ Indexes created for performance';
    RAISE NOTICE '✓ Row Level Security policies updated';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'You can now run the original setup script';
    RAISE NOTICE 'or populate with sample data as needed';
    RAISE NOTICE '========================================';
END $$;