-- ==================================================
-- BrewQuest Chronicles Complete Database Schema
-- ==================================================
-- Comprehensive database schema for the 50-state beer journey blog
-- Includes blog posts, beer reviews, state progress, analytics, and social media automation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ==================================================
-- Core Blog Tables
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

-- ==================================================
-- State Progress Tracking
-- ==================================================

-- State Progress Table (Enhanced from existing schema)
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

-- ==================================================
-- Analytics and Tracking
-- ==================================================

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

-- Page Analytics Table
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(255),
  visitor_id VARCHAR(255),
  session_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  user_agent TEXT,
  ip_address INET,
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  screen_resolution VARCHAR(20),
  time_on_page INTEGER,
  bounce BOOLEAN DEFAULT false,
  conversion_event VARCHAR(100),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  beer_review_id UUID REFERENCES beer_reviews(id) ON DELETE SET NULL,
  state_code VARCHAR(2)
);

-- Map Interactions Table (for legacy support)
CREATE TABLE IF NOT EXISTS map_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(255) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Brewery Features
-- ==================================================

-- Brewery Features Table (Enhanced)
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
  distribution_area VARCHAR(100),
  tour_availability BOOLEAN DEFAULT false,
  food_service BOOLEAN DEFAULT false,
  outdoor_seating BOOLEAN DEFAULT false,
  family_friendly BOOLEAN DEFAULT false,
  dog_friendly BOOLEAN DEFAULT false,
  parking_availability VARCHAR(100),
  accessibility_features TEXT[],
  seasonal_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Journey Milestones
-- ==================================================

-- Journey Milestones Table (Enhanced)
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN (
    'state_completion',
    'region_completion', 
    'brewery_milestone',
    'beer_milestone',
    'engagement_milestone',
    'technical_milestone',
    'partnership_milestone',
    'content_milestone'
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
  social_engagement_count INTEGER DEFAULT 0,
  newsletter_featured BOOLEAN DEFAULT false,
  press_coverage TEXT[],
  community_reaction_score INTEGER CHECK (community_reaction_score >= 1 AND community_reaction_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Social Media Management
-- ==================================================

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beer_review_id UUID REFERENCES beer_reviews(id) ON DELETE SET NULL,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'instagram', 'facebook', 'linkedin', 'tiktok')),
  content TEXT NOT NULL,
  image_url TEXT,
  hashtags TEXT[],
  scheduled_time TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  engagement_metrics JSONB,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Campaigns Table
CREATE TABLE IF NOT EXISTS social_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) CHECK (campaign_type IN ('launch', 'weekly', 'milestone', 'seasonal', 'brewmetrics')),
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(10,2),
  target_metrics JSONB,
  actual_metrics JSONB,
  states_included TEXT[],
  platforms TEXT[],
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Newsletter Management
-- ==================================================

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(100), -- where they signed up from
  state_interest VARCHAR(2), -- which state they're most interested in
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  state_focus VARCHAR(2),
  week_number INTEGER,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- Audit Trail
-- ==================================================

-- State Progress Audit Table
CREATE TABLE IF NOT EXISTS state_progress_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- ==================================================
-- Materialized Views
-- ==================================================

-- Map Interaction Summary View
CREATE MATERIALIZED VIEW IF NOT EXISTS map_interaction_summary AS
SELECT 
  sp.state_code,
  sp.state_name,
  sp.status,
  sp.region,
  COUNT(sa.id) as total_interactions,
  COUNT(CASE WHEN sa.interaction_type = 'click' THEN 1 END) as total_clicks,
  COUNT(CASE WHEN sa.interaction_type = 'hover' THEN 1 END) as total_hovers,
  COUNT(DISTINCT sa.session_id) as unique_sessions,
  AVG(sa.duration_ms) as avg_interaction_duration,
  MAX(sa.timestamp) as last_interaction,
  COUNT(CASE WHEN sa.device_type = 'mobile' THEN 1 END) as mobile_interactions,
  COUNT(CASE WHEN sa.device_type = 'desktop' THEN 1 END) as desktop_interactions
FROM state_progress sp
LEFT JOIN state_analytics sa ON sp.state_code = sa.state_code
WHERE sa.timestamp >= NOW() - INTERVAL '30 days' OR sa.timestamp IS NULL
GROUP BY sp.state_code, sp.state_name, sp.status, sp.region;

-- ==================================================
-- Indexes for Performance
-- ==================================================

-- Blog Posts Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_state ON blog_posts(state);
CREATE INDEX IF NOT EXISTS idx_blog_posts_week_number ON blog_posts(week_number);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Beer Reviews Indexes
CREATE INDEX IF NOT EXISTS idx_beer_reviews_blog_post_id ON beer_reviews(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_day_of_week ON beer_reviews(day_of_week);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);

-- State Progress Indexes
CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);
CREATE INDEX IF NOT EXISTS idx_state_progress_completion_date ON state_progress(completion_date);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_interaction_type ON state_analytics(interaction_type);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_id ON state_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_state_analytics_device_type ON state_analytics(device_type);
CREATE INDEX IF NOT EXISTS idx_state_analytics_composite ON state_analytics(state_code, interaction_type, timestamp DESC);

-- Page Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_page_analytics_timestamp ON page_analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_session_id ON page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_blog_post_id ON page_analytics(blog_post_id) WHERE blog_post_id IS NOT NULL;

-- Brewery Features Indexes
CREATE INDEX IF NOT EXISTS idx_brewery_features_state_code ON brewery_features(state_code);
CREATE INDEX IF NOT EXISTS idx_brewery_features_brewery_type ON brewery_features(brewery_type);
CREATE INDEX IF NOT EXISTS idx_brewery_features_visit_priority ON brewery_features(visit_priority);
CREATE INDEX IF NOT EXISTS idx_brewery_features_featured_week ON brewery_features(featured_week);
CREATE INDEX IF NOT EXISTS idx_brewery_features_composite ON brewery_features(state_code, visit_priority, is_active);

-- Journey Milestones Indexes
CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_type ON journey_milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_date ON journey_milestones(milestone_date DESC);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_week_number ON journey_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_celebration_level ON journey_milestones(celebration_level);

-- Social Posts Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_beer_review_id ON social_posts(beer_review_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_time ON social_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);

-- Newsletter Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);

-- Audit Trail Indexes  
CREATE INDEX IF NOT EXISTS idx_state_progress_audit_table_record ON state_progress_audit(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_state_progress_audit_changed_at ON state_progress_audit(changed_at DESC);

-- GIN Indexes for Array and JSONB Fields
CREATE INDEX IF NOT EXISTS idx_state_progress_featured_breweries_gin ON state_progress USING GIN(featured_breweries);
CREATE INDEX IF NOT EXISTS idx_state_progress_highlights_gin ON state_progress USING GIN(journey_highlights);
CREATE INDEX IF NOT EXISTS idx_brewery_features_styles_gin ON brewery_features USING GIN(specialty_styles);
CREATE INDEX IF NOT EXISTS idx_brewery_features_beers_gin ON brewery_features USING GIN(signature_beers);
CREATE INDEX IF NOT EXISTS idx_brewery_features_social_gin ON brewery_features USING GIN(social_media);
CREATE INDEX IF NOT EXISTS idx_state_analytics_metadata_gin ON state_analytics USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_metadata_gin ON journey_milestones USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_social_posts_hashtags_gin ON social_posts USING GIN(hashtags);

-- Unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_map_interaction_summary_state_code ON map_interaction_summary(state_code);

-- ==================================================
-- Database Functions
-- ==================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Get current journey week function
CREATE OR REPLACE FUNCTION get_current_journey_week()
RETURNS INTEGER AS $$
DECLARE
  start_date DATE := '2024-01-01';
  current_week INTEGER;
BEGIN
  current_week := CEIL(EXTRACT(EPOCH FROM (NOW() - start_date)) / (7 * 24 * 60 * 60)) :: INTEGER;
  RETURN LEAST(GREATEST(current_week, 1), 50);
END;
$$ LANGUAGE plpgsql;

-- Auto-update state status function
CREATE OR REPLACE FUNCTION update_state_status()
RETURNS TRIGGER AS $$
DECLARE
  current_week INTEGER;
BEGIN
  current_week := get_current_journey_week();
  
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status = NEW.status) THEN
    IF NEW.week_number < current_week AND NEW.status != 'completed' THEN
      NEW.status := 'completed';
      NEW.completion_date := COALESCE(NEW.completion_date, NOW());
    ELSIF NEW.week_number = current_week AND NEW.status != 'completed' THEN
      NEW.status := 'current';
    ELSIF NEW.week_number > current_week THEN
      NEW.status := 'upcoming';
      NEW.completion_date := NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_state_progress_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO state_progress_audit (
    table_name,
    record_id,
    operation,
    old_values,
    new_values,
    changed_by
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    NULL -- Will be set by auth context in application
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Database health function
CREATE OR REPLACE FUNCTION get_database_health()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'table_sizes', (
      SELECT jsonb_object_agg(
        table_name, 
        pg_size_pretty(pg_total_relation_size(('public.' || table_name)::regclass))
      )
      FROM (VALUES 
        ('blog_posts'), ('beer_reviews'), ('state_progress'), ('state_analytics'), 
        ('brewery_features'), ('journey_milestones'), ('social_posts')
      ) AS t(table_name)
    ),
    'record_counts', (
      SELECT jsonb_build_object(
        'blog_posts', (SELECT count(*) FROM blog_posts),
        'beer_reviews', (SELECT count(*) FROM beer_reviews),
        'state_progress', (SELECT count(*) FROM state_progress),
        'state_analytics', (SELECT count(*) FROM state_analytics),
        'brewery_features', (SELECT count(*) FROM brewery_features),
        'journey_milestones', (SELECT count(*) FROM journey_milestones),
        'social_posts', (SELECT count(*) FROM social_posts)
      )
    ),
    'cache_hit_ratio', (
      SELECT round(
        100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read) + 1), 2
      )
      FROM pg_statio_user_tables
    ),
    'last_updated', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Journey statistics function
CREATE OR REPLACE FUNCTION get_journey_statistics()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_states', COUNT(*),
    'completed_states', COUNT(*) FILTER (WHERE status = 'completed'),
    'current_week', get_current_journey_week(),
    'total_breweries', SUM(total_breweries),
    'total_research_hours', SUM(research_hours),
    'completion_percentage', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2),
    'total_blog_posts', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published'),
    'total_beer_reviews', (SELECT COUNT(*) FROM beer_reviews),
    'regions_stats', (
      SELECT jsonb_object_agg(
        region,
        jsonb_build_object(
          'total', COUNT(*),
          'completed', COUNT(*) FILTER (WHERE status = 'completed'),
          'percentage', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2)
        )
      )
      FROM state_progress 
      GROUP BY region
    )
  ) INTO stats
  FROM state_progress;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- State engagement summary function
CREATE OR REPLACE FUNCTION get_state_engagement_summary(
  time_period_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
  state_code VARCHAR(2),
  state_name VARCHAR(50),
  total_interactions BIGINT,
  unique_sessions BIGINT,
  avg_duration_ms NUMERIC,
  mobile_percentage NUMERIC,
  top_interaction_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.state_code,
    sp.state_name,
    COUNT(sa.id) as total_interactions,
    COUNT(DISTINCT sa.session_id) as unique_sessions,
    ROUND(AVG(sa.duration_ms), 2) as avg_duration_ms,
    ROUND(
      100.0 * COUNT(CASE WHEN sa.device_type = 'mobile' THEN 1 END) / NULLIF(COUNT(sa.id), 0), 
      2
    ) as mobile_percentage,
    (
      SELECT sa2.interaction_type 
      FROM state_analytics sa2 
      WHERE sa2.state_code = sp.state_code 
      AND sa2.timestamp >= NOW() - (time_period_hours || ' hours')::INTERVAL
      GROUP BY sa2.interaction_type 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as top_interaction_type
  FROM state_progress sp
  LEFT JOIN state_analytics sa ON sp.state_code = sa.state_code
  WHERE sa.timestamp >= NOW() - (time_period_hours || ' hours')::INTERVAL
     OR sa.timestamp IS NULL
  GROUP BY sp.state_code, sp.state_name
  ORDER BY total_interactions DESC;
END;
$$ LANGUAGE plpgsql;

-- Refresh materialized views function
CREATE OR REPLACE FUNCTION refresh_state_progress_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY map_interaction_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- Triggers
-- ==================================================

-- Updated timestamp triggers
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beer_reviews_updated_at 
    BEFORE UPDATE ON beer_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_progress_updated_at 
    BEFORE UPDATE ON state_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brewery_features_updated_at 
    BEFORE UPDATE ON brewery_features 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at 
    BEFORE UPDATE ON social_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_campaigns_updated_at 
    BEFORE UPDATE ON social_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaigns_updated_at 
    BEFORE UPDATE ON newsletter_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- State status update trigger
CREATE TRIGGER state_status_update_trigger
    BEFORE INSERT OR UPDATE ON state_progress
    FOR EACH ROW EXECUTE FUNCTION update_state_status();

-- Audit triggers
CREATE TRIGGER audit_state_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON state_progress
  FOR EACH ROW EXECUTE FUNCTION audit_state_progress_changes();

CREATE TRIGGER audit_brewery_features_trigger
  AFTER INSERT OR UPDATE OR DELETE ON brewery_features
  FOR EACH ROW EXECUTE FUNCTION audit_state_progress_changes();

CREATE TRIGGER audit_journey_milestones_trigger
  AFTER INSERT OR UPDATE OR DELETE ON journey_milestones
  FOR EACH ROW EXECUTE FUNCTION audit_state_progress_changes();

-- ==================================================
-- Row Level Security (RLS) Policies
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Public read policies for blog content
CREATE POLICY "Public read published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read beer reviews" ON beer_reviews
    FOR SELECT USING (true);

CREATE POLICY "Public read state progress" ON state_progress
    FOR SELECT USING (true);

CREATE POLICY "Public read active brewery features" ON brewery_features
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read public milestones" ON journey_milestones
    FOR SELECT USING (is_public = true);

-- Analytics insertion policies
CREATE POLICY "Allow analytics inserts" ON state_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow page analytics inserts" ON page_analytics
    FOR INSERT WITH CHECK (true);

-- Admin access policies (when authentication is implemented)
-- These can be enabled later when auth is set up
/*
CREATE POLICY "Admin full access to blog_posts" ON blog_posts
    FOR ALL USING (
      auth.role() = 'authenticated' AND 
      (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
    );
*/

-- ==================================================
-- Initial Data Population
-- ==================================================

-- Insert all 50 states with complete data
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
  updated_at = NOW();

-- Refresh materialized view after initial data insertion
REFRESH MATERIALIZED VIEW map_interaction_summary;

-- ==================================================
-- Real-time Subscriptions
-- ==================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE beer_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE state_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;

-- ==================================================
-- Comments and Documentation
-- ==================================================

COMMENT ON TABLE blog_posts IS 'Main blog posts for the 50-state beer journey';
COMMENT ON TABLE beer_reviews IS 'Individual beer reviews (7 per state for daily content)';
COMMENT ON TABLE state_progress IS 'Tracks completion status and progress for each state in the 50-state journey';
COMMENT ON TABLE state_analytics IS 'Captures user interactions with the interactive map for analytics and UX improvements';
COMMENT ON TABLE brewery_features IS 'Stores detailed information about featured breweries in each state';
COMMENT ON TABLE journey_milestones IS 'Records significant achievements and events throughout the journey';
COMMENT ON TABLE social_posts IS 'Manages social media content scheduling and posting';
COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscriber management';

COMMENT ON COLUMN state_progress.week_number IS 'Sequential week number (1-50) corresponding to state exploration schedule';
COMMENT ON COLUMN beer_reviews.day_of_week IS 'Day of week (1-7) for daily beer content scheduling';
COMMENT ON COLUMN brewery_features.visit_priority IS 'Priority ranking (1-10) for brewery visit recommendations';
COMMENT ON COLUMN journey_milestones.celebration_level IS 'Significance level for milestone celebrations and social media';

COMMENT ON FUNCTION get_database_health() IS 'Returns comprehensive database health metrics including table sizes, record counts, index usage, and connection stats';
COMMENT ON FUNCTION get_journey_statistics() IS 'Returns complete journey statistics including progress, content counts, and regional breakdowns';
COMMENT ON FUNCTION get_state_engagement_summary(INTEGER) IS 'Returns engagement analytics summary for all states within specified time period';

-- ==================================================
-- Final Setup Message
-- ==================================================

DO $$
BEGIN
  RAISE NOTICE 'BrewQuest Chronicles database schema setup complete!';
  RAISE NOTICE 'Tables created: blog_posts, beer_reviews, state_progress, state_analytics, page_analytics, brewery_features, journey_milestones, social_posts, social_campaigns, newsletter_subscribers, newsletter_campaigns';
  RAISE NOTICE 'All 50 states populated with Alabama set as current (week 1)';
  RAISE NOTICE 'RLS policies enabled for public read access';
  RAISE NOTICE 'Indexes optimized for blog performance';
  RAISE NOTICE 'Real-time subscriptions configured';
  RAISE NOTICE 'Run "SELECT get_journey_statistics();" to see current status';
END $$;