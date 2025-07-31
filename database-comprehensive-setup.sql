-- ===================================================================
-- COMPREHENSIVE SUPABASE DATABASE SETUP FOR HOP HARRISON BEER BLOG
-- ===================================================================
-- Complete database schema setup for 50-state beer journey with
-- blog content, social media integration, analytics, and real-time features
-- 
-- Execute sections in order for proper dependency resolution
-- ===================================================================

-- ===================================================================
-- SECTION 1: EXTENSIONS AND BASIC SETUP
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===================================================================
-- SECTION 2: CORE BLOG AND CONTENT TABLES
-- ===================================================================

-- Blog Posts Table (Enhanced with SEO and analytics)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  state VARCHAR(50) NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 50),
  read_time INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  seo_meta_description TEXT,
  seo_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID -- Future multi-author support
);

-- Beer Reviews Table (Extended for detailed tracking)
CREATE TABLE IF NOT EXISTS beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  brewery_name VARCHAR(200) NOT NULL,
  beer_name VARCHAR(200) NOT NULL,
  beer_style VARCHAR(100) NOT NULL,
  abv DECIMAL(4,2),
  ibu INTEGER,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
  tasting_notes TEXT,
  unique_feature TEXT,
  brewery_story TEXT,
  brewery_location VARCHAR(200),
  image_url TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  state_code VARCHAR(2) NOT NULL,
  state_name VARCHAR(50) NOT NULL,
  week_number INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Additional beer data
  brewery_type VARCHAR(50) CHECK (brewery_type IN ('microbrewery', 'brewpub', 'large', 'regional', 'contract', 'proprietor')),
  brewery_founded_year INTEGER,
  price_point VARCHAR(20) CHECK (price_point IN ('budget', 'moderate', 'premium', 'luxury')),
  availability VARCHAR(50) CHECK (availability IN ('year_round', 'seasonal', 'limited', 'one_off')),
  food_pairings TEXT[],
  alcohol_content_category VARCHAR(20) CHECK (alcohol_content_category IN ('session', 'standard', 'strong', 'imperial'))
);

-- State Progress Table (Core journey tracking)
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
  region VARCHAR(20) NOT NULL,
  description TEXT,
  journey_highlights TEXT[],
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  research_hours INTEGER DEFAULT 0 CHECK (research_hours >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Social media tracking
  social_posts_generated INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  visit_planned BOOLEAN DEFAULT FALSE,
  visit_completed BOOLEAN DEFAULT FALSE,
  visit_date TIMESTAMP WITH TIME ZONE
);

-- ===================================================================
-- SECTION 3: SOCIAL MEDIA INTEGRATION
-- ===================================================================

-- Social Posts Table (Enhanced for comprehensive tracking)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beer_review_id UUID REFERENCES beer_reviews(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube')),
  post_type VARCHAR(30) NOT NULL CHECK (post_type IN ('beer_review', 'brewery_spotlight', 'state_announcement', 'milestone', 'behind_scenes', 'educational', 'engagement')),
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  hashtags TEXT[],
  scheduled_time TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  post_url TEXT, -- Link to actual post after publishing
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed', 'archived')),
  engagement_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Advanced social media features
  target_audience VARCHAR(50),
  geo_targeting VARCHAR(100),
  promotion_budget DECIMAL(8,2),
  campaign_id VARCHAR(100),
  cross_post_to TEXT[], -- Other platforms to cross-post
  approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_revision'))
);

-- Social Media Campaign Tracking
CREATE TABLE IF NOT EXISTS social_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(30) CHECK (campaign_type IN ('state_launch', 'brewery_feature', 'milestone_celebration', 'brewmetrics_promotion', 'engagement_boost')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  budget DECIMAL(10,2),
  target_metrics JSONB DEFAULT '{}',
  actual_metrics JSONB DEFAULT '{}',
  states_included TEXT[],
  platforms TEXT[],
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link social posts to campaigns
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES social_campaigns(id) ON DELETE SET NULL;

-- ===================================================================
-- SECTION 4: NEWSLETTER AND SUBSCRIBER MANAGEMENT
-- ===================================================================

-- Newsletter Subscribers (Enhanced with segmentation)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  subscription_source VARCHAR(50), -- where they signed up
  tags TEXT[], -- for segmentation
  last_email_opened TIMESTAMP WITH TIME ZONE,
  total_emails_opened INTEGER DEFAULT 0,
  total_emails_sent INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  preferred_content_types TEXT[],
  geographic_region VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Campaigns
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  campaign_type VARCHAR(30) CHECK (campaign_type IN ('weekly_update', 'state_spotlight', 'brewery_feature', 'milestone', 'brewmetrics_intro', 'special_announcement')),
  scheduled_send TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- SECTION 5: ANALYTICS AND TRACKING
-- ===================================================================

-- Page Analytics (Enhanced for blog content)
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
  country VARCHAR(50),
  region VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(20) CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser VARCHAR(50),
  os VARCHAR(50),
  screen_resolution VARCHAR(20),
  time_on_page INTEGER, -- seconds
  bounce BOOLEAN DEFAULT FALSE,
  conversion_event VARCHAR(100), -- newsletter signup, social follow, etc.
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  beer_review_id UUID REFERENCES beer_reviews(id) ON DELETE SET NULL,
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE SET NULL
);

-- State Analytics (Interactive map and engagement)
CREATE TABLE IF NOT EXISTS state_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  interaction_type VARCHAR(30) NOT NULL CHECK (interaction_type IN ('hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap', 'share', 'bookmark')),
  session_id VARCHAR(255) NOT NULL,
  user_agent TEXT,
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  source_page VARCHAR(200),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  referrer TEXT,
  conversion_event VARCHAR(100),
  user_id UUID -- for authenticated user tracking
);

-- Map Interactions (Simplified analytics)
CREATE TABLE IF NOT EXISTS map_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('hover', 'click', 'navigation', 'tooltip_view', 'completion_celebration', 'share')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- SECTION 6: EXTENDED BREWERY AND JOURNEY TRACKING
-- ===================================================================

-- Brewery Features (Detailed brewery information)
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
  social_media JSONB DEFAULT '{}',
  awards TEXT[],
  capacity_barrels INTEGER,
  taproom_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  featured_week INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Additional brewery metadata
  distribution_area VARCHAR(100),
  tour_availability BOOLEAN DEFAULT FALSE,
  food_service BOOLEAN DEFAULT FALSE,
  outdoor_seating BOOLEAN DEFAULT FALSE,
  family_friendly BOOLEAN DEFAULT FALSE,
  dog_friendly BOOLEAN DEFAULT FALSE,
  parking_availability VARCHAR(50),
  accessibility_features TEXT[],
  seasonal_hours JSONB DEFAULT '{}'
);

-- Journey Milestones (Achievement tracking)
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN (
    'state_completion', 'region_completion', 'brewery_milestone', 'beer_milestone',
    'engagement_milestone', 'technical_milestone', 'partnership_milestone', 
    'content_milestone', 'brewmetrics_milestone', 'social_milestone'
  )),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE SET NULL,
  week_number INTEGER CHECK (week_number >= 1 AND week_number <= 50),
  milestone_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metric_value INTEGER,
  metric_unit VARCHAR(50),
  celebration_level VARCHAR(20) CHECK (celebration_level IN ('minor', 'major', 'epic')) DEFAULT 'minor',
  social_media_posted BOOLEAN DEFAULT FALSE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Social and engagement tracking
  social_engagement_count INTEGER DEFAULT 0,
  newsletter_featured BOOLEAN DEFAULT FALSE,
  press_coverage TEXT[],
  community_reaction_score DECIMAL(3,1)
);

-- ===================================================================
-- SECTION 7: INDEXES FOR PERFORMANCE OPTIMIZATION
-- ===================================================================

-- Blog Posts Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_state ON blog_posts(state);
CREATE INDEX IF NOT EXISTS idx_blog_posts_week_number ON blog_posts(week_number);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_seo_keywords ON blog_posts USING GIN(seo_keywords);

-- Beer Reviews Indexes
CREATE INDEX IF NOT EXISTS idx_beer_reviews_blog_post_id ON beer_reviews(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_brewery_name ON beer_reviews(brewery_name);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_beer_style ON beer_reviews(beer_style);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_rating ON beer_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_brewery_type ON beer_reviews(brewery_type);

-- State Progress Indexes
CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);
CREATE INDEX IF NOT EXISTS idx_state_progress_completion_date ON state_progress(completion_date);
CREATE INDEX IF NOT EXISTS idx_state_progress_visit_status ON state_progress(visit_planned, visit_completed);

-- Social Posts Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_time ON social_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_social_posts_posted_at ON social_posts(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_state_code ON social_posts(state_code);
CREATE INDEX IF NOT EXISTS idx_social_posts_post_type ON social_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign_id ON social_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_approval_status ON social_posts(approval_status);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_page_analytics_timestamp ON page_analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_session_id ON page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_blog_post_id ON page_analytics(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_state_code ON page_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_page_analytics_device_type ON page_analytics(device_type);
CREATE INDEX IF NOT EXISTS idx_page_analytics_conversion ON page_analytics(conversion_event) WHERE conversion_event IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_interaction_type ON state_analytics(interaction_type);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_id ON state_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_state_analytics_device_type ON state_analytics(device_type);

CREATE INDEX IF NOT EXISTS idx_map_interactions_state_code ON map_interactions(state_code);
CREATE INDEX IF NOT EXISTS idx_map_interactions_action ON map_interactions(action);
CREATE INDEX IF NOT EXISTS idx_map_interactions_timestamp ON map_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_map_interactions_session_id ON map_interactions(session_id);

-- Newsletter Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_tags ON newsletter_subscribers USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_engagement ON newsletter_subscribers(engagement_score DESC);

-- Composite Indexes for Common Queries
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform_status ON social_posts(platform, status);
CREATE INDEX IF NOT EXISTS idx_page_analytics_path_timestamp ON page_analytics(page_path, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_state_analytics_composite ON state_analytics(state_code, interaction_type, timestamp DESC);

-- GIN Indexes for Array and JSONB Fields
CREATE INDEX IF NOT EXISTS idx_state_progress_featured_breweries ON state_progress USING GIN(featured_breweries);
CREATE INDEX IF NOT EXISTS idx_state_progress_journey_highlights ON state_progress USING GIN(journey_highlights);
CREATE INDEX IF NOT EXISTS idx_social_posts_hashtags ON social_posts USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_social_posts_engagement_metrics ON social_posts USING GIN(engagement_metrics);
CREATE INDEX IF NOT EXISTS idx_brewery_features_specialty_styles ON brewery_features USING GIN(specialty_styles);
CREATE INDEX IF NOT EXISTS idx_brewery_features_signature_beers ON brewery_features USING GIN(signature_beers);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_preferences ON newsletter_subscribers USING GIN(preferences);

-- ===================================================================
-- SECTION 8: ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (for published content)
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

CREATE POLICY "Public read posted social posts" ON social_posts
  FOR SELECT USING (status = 'posted');

-- Analytics Insert Policies (allow tracking)
CREATE POLICY "Allow analytics inserts" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow state analytics inserts" ON state_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow map interaction inserts" ON map_interactions
  FOR INSERT WITH CHECK (true);

-- Admin/Editor Full Access Policies
CREATE POLICY "Admin full access to blog posts" ON blog_posts
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to beer reviews" ON beer_reviews
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to state progress" ON state_progress
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to social posts" ON social_posts
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to social campaigns" ON social_campaigns
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin full access to newsletter subscribers" ON newsletter_subscribers
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin full access to newsletter campaigns" ON newsletter_campaigns
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin full access to brewery features" ON brewery_features
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to journey milestones" ON journey_milestones
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

-- Analytics Read Policies (admin only)
CREATE POLICY "Admin read analytics" ON page_analytics
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin read state analytics" ON state_analytics
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin read map interactions" ON map_interactions
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Newsletter Self-Management (subscribers can update their own data)
CREATE POLICY "Subscribers can update own data" ON newsletter_subscribers
  FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- ===================================================================
-- SECTION 9: TRIGGERS AND AUTOMATION FUNCTIONS
-- ===================================================================

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Updated At Triggers
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beer_reviews_updated_at BEFORE UPDATE ON beer_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_progress_updated_at BEFORE UPDATE ON state_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_campaigns_updated_at BEFORE UPDATE ON social_campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON newsletter_subscribers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brewery_features_updated_at BEFORE UPDATE ON brewery_features 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog Post View Counter Function
CREATE OR REPLACE FUNCTION increment_blog_post_views()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.blog_post_id IS NOT NULL THEN
    UPDATE blog_posts 
    SET view_count = view_count + 1 
    WHERE id = NEW.blog_post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply View Counter Trigger
CREATE TRIGGER increment_blog_views_trigger
  AFTER INSERT ON page_analytics
  FOR EACH ROW
  EXECUTE FUNCTION increment_blog_post_views();

-- Journey Week Calculator Function
CREATE OR REPLACE FUNCTION get_current_journey_week()
RETURNS INTEGER AS $$
DECLARE
  start_date DATE := '2024-01-01'; -- Adjust based on actual start date
  current_week INTEGER;
BEGIN
  current_week := CEIL(EXTRACT(EPOCH FROM (NOW() - start_date)) / (7 * 24 * 60 * 60))::INTEGER;
  RETURN LEAST(GREATEST(current_week, 1), 50);
END;
$$ LANGUAGE plpgsql;

-- Auto-update State Status Function
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

-- Apply State Status Update Trigger
CREATE TRIGGER state_status_update_trigger
  BEFORE INSERT OR UPDATE ON state_progress
  FOR EACH ROW EXECUTE FUNCTION update_state_status();

-- ===================================================================
-- SECTION 10: MATERIALIZED VIEWS FOR ANALYTICS
-- ===================================================================

-- Weekly Blog Performance View
CREATE MATERIALIZED VIEW IF NOT EXISTS weekly_blog_performance AS
SELECT 
  bp.week_number,
  bp.state,
  bp.title,
  bp.view_count,
  COUNT(pa.id) as analytics_events,
  COUNT(DISTINCT pa.session_id) as unique_sessions,
  AVG(pa.time_on_page) as avg_time_on_page,
  COUNT(pa.id) FILTER (WHERE pa.conversion_event IS NOT NULL) as conversions,
  bp.published_at
FROM blog_posts bp
LEFT JOIN page_analytics pa ON bp.id = pa.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.week_number, bp.state, bp.title, bp.view_count, bp.published_at
ORDER BY bp.week_number;

-- State Engagement Summary View
CREATE MATERIALIZED VIEW IF NOT EXISTS state_engagement_summary AS
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

-- Social Media Performance View
CREATE MATERIALIZED VIEW IF NOT EXISTS social_media_performance AS
SELECT 
  sp.platform,
  sp.post_type,
  sp.state_code,
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE sp.status = 'posted') as posted_count,
  AVG((sp.engagement_metrics->>'likes')::int) as avg_likes,
  AVG((sp.engagement_metrics->>'shares')::int) as avg_shares,
  AVG((sp.engagement_metrics->>'comments')::int) as avg_comments,
  MAX(sp.posted_at) as last_post
FROM social_posts sp
WHERE sp.posted_at >= NOW() - INTERVAL '30 days'
GROUP BY sp.platform, sp.post_type, sp.state_code;

-- Create indexes for materialized views
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_blog_performance_week_state 
ON weekly_blog_performance(week_number, state);

CREATE UNIQUE INDEX IF NOT EXISTS idx_state_engagement_summary_state_code 
ON state_engagement_summary(state_code);

CREATE INDEX IF NOT EXISTS idx_social_media_performance_platform_type 
ON social_media_performance(platform, post_type);

-- ===================================================================
-- SECTION 11: UTILITY FUNCTIONS
-- ===================================================================

-- Database Health Function
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
        ('blog_posts'), ('beer_reviews'), ('state_progress'), ('social_posts'),
        ('newsletter_subscribers'), ('page_analytics'), ('state_analytics'),
        ('brewery_features'), ('journey_milestones')
      ) AS t(table_name)
    ),
    'record_counts', (
      SELECT jsonb_build_object(
        'blog_posts', (SELECT count(*) FROM blog_posts),
        'beer_reviews', (SELECT count(*) FROM beer_reviews),
        'state_progress', (SELECT count(*) FROM state_progress),
        'social_posts', (SELECT count(*) FROM social_posts),
        'newsletter_subscribers', (SELECT count(*) FROM newsletter_subscribers),
        'page_analytics', (SELECT count(*) FROM page_analytics),
        'state_analytics', (SELECT count(*) FROM state_analytics)
      )
    ),
    'cache_hit_ratio', (
      SELECT round(
        100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read) + 1), 2
      )
      FROM pg_statio_user_tables
    ),
    'active_connections', (
      SELECT count(*) FROM pg_stat_activity WHERE state = 'active'
    ),
    'last_updated', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Journey Statistics Function
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
    'total_social_posts', (SELECT COUNT(*) FROM social_posts WHERE status = 'posted'),
    'newsletter_subscribers', (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true),
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

-- Content Performance Function
CREATE OR REPLACE FUNCTION get_content_performance(time_period_days INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
  performance JSONB;
BEGIN
  SELECT jsonb_build_object(
    'blog_performance', (
      SELECT jsonb_build_object(
        'total_posts', COUNT(*),
        'total_views', SUM(view_count),
        'avg_views_per_post', ROUND(AVG(view_count), 2),
        'most_viewed_post', (
          SELECT jsonb_build_object('title', title, 'views', view_count)
          FROM blog_posts 
          WHERE status = 'published' 
          ORDER BY view_count DESC 
          LIMIT 1
        )
      )
      FROM blog_posts 
      WHERE status = 'published' 
      AND published_at >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'social_performance', (
      SELECT jsonb_build_object(
        'total_posts', COUNT(*),
        'posts_by_platform', (
          SELECT jsonb_object_agg(platform, COUNT(*))
          FROM social_posts 
          WHERE status = 'posted' 
          AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
          GROUP BY platform
        ),
        'avg_engagement', (
          SELECT ROUND(AVG(
            COALESCE((engagement_metrics->>'likes')::int, 0) +
            COALESCE((engagement_metrics->>'shares')::int, 0) +
            COALESCE((engagement_metrics->>'comments')::int, 0)
          ), 2)
          FROM social_posts 
          WHERE status = 'posted' 
          AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
        )
      )
      FROM social_posts 
      WHERE status = 'posted' 
      AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'analytics_summary', (
      SELECT jsonb_build_object(
        'total_page_views', COUNT(*),
        'unique_sessions', COUNT(DISTINCT session_id),
        'avg_time_on_page', ROUND(AVG(time_on_page), 2),
        'mobile_percentage', ROUND(
          100.0 * COUNT(*) FILTER (WHERE device_type = 'mobile') / COUNT(*), 2
        ),
        'top_conversion_events', (
          SELECT jsonb_object_agg(conversion_event, COUNT(*))
          FROM page_analytics 
          WHERE conversion_event IS NOT NULL
          AND timestamp >= NOW() - (time_period_days || ' days')::INTERVAL
          GROUP BY conversion_event
          ORDER BY COUNT(*) DESC
          LIMIT 5
        )
      )
      FROM page_analytics 
      WHERE timestamp >= NOW() - (time_period_days || ' days')::INTERVAL
    )
  ) INTO performance;
  
  RETURN performance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refresh All Views Function
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_blog_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY state_engagement_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY social_media_performance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SECTION 12: REAL-TIME SUBSCRIPTIONS
-- ===================================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE state_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;

-- ===================================================================
-- SECTION 13: SAMPLE DATA POPULATION
-- ===================================================================

-- Insert sample state progress data (first few states)
INSERT INTO state_progress (
  state_code, state_name, week_number, region, description
) VALUES 
  ('AL', 'Alabama', 1, 'Southeast', 'Exploring Alabama''s emerging craft beer scene and BBQ pairings'),
  ('AK', 'Alaska', 2, 'West', 'Discovering unique brewing conditions in America''s last frontier'),
  ('AZ', 'Arizona', 3, 'Southwest', 'Desert brewing innovation and Southwestern flavors'),
  ('AR', 'Arkansas', 4, 'Southeast', 'Natural State''s growing craft beer culture'),
  ('CA', 'California', 5, 'West', 'The birthplace of American craft brewing')
ON CONFLICT (state_code) DO NOTHING;

-- Sample blog post for Alabama
INSERT INTO blog_posts (
  title, slug, excerpt, content, state, week_number, status,
  seo_meta_description, seo_keywords, is_featured
) VALUES (
  'Alabama Craft Beer: Heart of Dixie Brewing',
  'alabama-craft-beer-heart-dixie-brewing',
  'Discover Alabama''s emerging craft beer scene, from Birmingham''s urban breweries to Mobile''s coastal flavors.',
  'Alabama''s craft beer scene is experiencing tremendous growth...',
  'Alabama', 1, 'published',
  'Explore Alabama''s best craft breweries and beer culture in this comprehensive guide to the Heart of Dixie''s brewing scene.',
  ARRAY['Alabama craft beer', 'Birmingham breweries', 'Southern beer culture'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- Refresh materialized views after data insertion
SELECT refresh_all_materialized_views();

-- ===================================================================
-- SECTION 14: MAINTENANCE AND MONITORING
-- ===================================================================

-- Create a function to run daily maintenance
CREATE OR REPLACE FUNCTION run_daily_maintenance()
RETURNS VOID AS $$
BEGIN
  -- Refresh materialized views
  PERFORM refresh_all_materialized_views();
  
  -- Update state statuses based on current week
  UPDATE state_progress 
  SET status = CASE 
    WHEN week_number < get_current_journey_week() THEN 'completed'
    WHEN week_number = get_current_journey_week() THEN 'current'
    ELSE 'upcoming'
  END
  WHERE status != CASE 
    WHEN week_number < get_current_journey_week() THEN 'completed'
    WHEN week_number = get_current_journey_week() THEN 'current'
    ELSE 'upcoming'
  END;
  
  -- Clean up old analytics data (optional, adjust retention as needed)
  -- DELETE FROM page_analytics WHERE timestamp < NOW() - INTERVAL '1 year';
  -- DELETE FROM state_analytics WHERE timestamp < NOW() - INTERVAL '1 year';
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- COMMENTS AND DOCUMENTATION
-- ===================================================================

COMMENT ON TABLE blog_posts IS 'Main blog content for state-by-state beer journey';
COMMENT ON TABLE beer_reviews IS 'Detailed beer reviews linked to blog posts';
COMMENT ON TABLE state_progress IS 'Tracks completion status for 50-state journey';
COMMENT ON TABLE social_posts IS 'Social media content scheduling and tracking';
COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscriber management';
COMMENT ON TABLE page_analytics IS 'Web analytics and user behavior tracking';
COMMENT ON TABLE state_analytics IS 'Interactive map engagement analytics';
COMMENT ON TABLE brewery_features IS 'Detailed brewery information and features';
COMMENT ON TABLE journey_milestones IS 'Achievement tracking for journey progress';

COMMENT ON FUNCTION get_database_health() IS 'Returns comprehensive database health and performance metrics';
COMMENT ON FUNCTION get_journey_statistics() IS 'Returns journey progress and completion statistics';
COMMENT ON FUNCTION get_content_performance(INTEGER) IS 'Returns content performance metrics for specified time period';
COMMENT ON FUNCTION run_daily_maintenance() IS 'Performs daily database maintenance tasks';

-- ===================================================================
-- END OF COMPREHENSIVE DATABASE SETUP
-- ===================================================================

-- Final message
SELECT 'Hop Harrison Beer Blog Database Setup Complete!' as message;