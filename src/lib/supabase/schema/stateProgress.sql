-- ==================================================
-- Hop Harrison State Progress Tracking Schema
-- ==================================================
-- Comprehensive database schema for tracking state progress,
-- user interactions, brewery features, and journey milestones

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- State Progress Table
-- ==================================================
-- Track completion status and progress for each state in the 50-state journey
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);
CREATE INDEX IF NOT EXISTS idx_state_progress_completion_date ON state_progress(completion_date);

-- ==================================================
-- State Analytics Table
-- ==================================================
-- Track user interactions with the interactive map
CREATE TABLE IF NOT EXISTS state_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap')),
  session_id VARCHAR(255),
  user_agent TEXT,
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  source_page VARCHAR(100), -- where the interaction occurred
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER, -- how long the interaction lasted
  metadata JSONB, -- flexible storage for additional interaction data
  ip_address INET, -- for geographic analysis (anonymized)
  referrer TEXT
);

-- Create indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_interaction_type ON state_analytics(interaction_type);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_id ON state_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_state_analytics_device_type ON state_analytics(device_type);

-- ==================================================
-- Brewery Features Table
-- ==================================================
-- Store detailed information about featured breweries per state
CREATE TABLE IF NOT EXISTS brewery_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  brewery_name VARCHAR(200) NOT NULL,
  brewery_type VARCHAR(50) CHECK (brewery_type IN ('microbrewery', 'brewpub', 'large', 'regional', 'contract', 'proprietor')),
  city VARCHAR(100) NOT NULL,
  address TEXT,
  website_url TEXT,
  founded_year INTEGER CHECK (founded_year >= 1600 AND founded_year <= EXTRACT(YEAR FROM NOW())),
  specialty_styles TEXT[], -- array of beer styles they're known for
  signature_beers TEXT[], -- their flagship beers
  brewery_description TEXT,
  why_featured TEXT, -- explanation of why this brewery was selected
  visit_priority INTEGER CHECK (visit_priority >= 1 AND visit_priority <= 10), -- 1 = highest priority
  social_media JSONB, -- social media links and handles
  awards TEXT[], -- notable awards or recognition
  capacity_barrels INTEGER, -- annual production capacity
  taproom_info JSONB, -- taproom hours, amenities, etc.
  is_active BOOLEAN DEFAULT true,
  featured_week INTEGER, -- which week this brewery was featured
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for brewery features
CREATE INDEX IF NOT EXISTS idx_brewery_features_state_code ON brewery_features(state_code);
CREATE INDEX IF NOT EXISTS idx_brewery_features_brewery_type ON brewery_features(brewery_type);
CREATE INDEX IF NOT EXISTS idx_brewery_features_visit_priority ON brewery_features(visit_priority);
CREATE INDEX IF NOT EXISTS idx_brewery_features_featured_week ON brewery_features(featured_week);

-- ==================================================
-- Journey Milestones Table
-- ==================================================
-- Track major events and achievements throughout the 50-state journey
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
  metric_value INTEGER, -- quantifiable achievement (e.g., 100th brewery)
  metric_unit VARCHAR(50), -- what the metric represents
  celebration_level VARCHAR(20) CHECK (celebration_level IN ('minor', 'major', 'epic')) DEFAULT 'minor',
  social_media_posted BOOLEAN DEFAULT false,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  metadata JSONB, -- additional milestone data
  is_public BOOLEAN DEFAULT true, -- whether to show publicly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for journey milestones
CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_type ON journey_milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_date ON journey_milestones(milestone_date);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_week_number ON journey_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_celebration_level ON journey_milestones(celebration_level);

-- ==================================================
-- Map Interaction Summary View
-- ==================================================
-- Materialized view for efficient analytics queries
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

-- Create index for the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_map_interaction_summary_state_code 
ON map_interaction_summary(state_code);

-- ==================================================
-- Update Triggers
-- ==================================================
-- Automatically update timestamps on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_state_progress_updated_at 
    BEFORE UPDATE ON state_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brewery_features_updated_at 
    BEFORE UPDATE ON brewery_features 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- Row Level Security (RLS) Policies
-- ==================================================
-- Enable RLS on all tables
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Public read access for state progress (needed for map display)
CREATE POLICY "Public read access for state_progress" ON state_progress
    FOR SELECT USING (true);

-- Public read access for brewery features (needed for public display)
CREATE POLICY "Public read access for brewery_features" ON brewery_features
    FOR SELECT USING (is_active = true);

-- Public read access for public milestones
CREATE POLICY "Public read access for journey_milestones" ON journey_milestones
    FOR SELECT USING (is_public = true);

-- Analytics table - allow inserts from authenticated users, no public reads
CREATE POLICY "Allow analytics inserts" ON state_analytics
    FOR INSERT WITH CHECK (true);

-- Admin access policies (more granular permissions)
CREATE POLICY "Admin full access to state_progress" ON state_progress
    FOR ALL USING (
      auth.role() = 'authenticated' AND 
      (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
    );

CREATE POLICY "Admin full access to brewery_features" ON brewery_features
    FOR ALL USING (
      auth.role() = 'authenticated' AND 
      (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
    );

CREATE POLICY "Admin full access to journey_milestones" ON journey_milestones
    FOR ALL USING (
      auth.role() = 'authenticated' AND 
      (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
    );

-- Separate policies for different access levels
CREATE POLICY "Admin read access to state_analytics" ON state_analytics
    FOR SELECT USING (
      auth.role() = 'authenticated' AND 
      auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Editor read-only access to state_analytics" ON state_analytics
    FOR SELECT USING (
      auth.role() = 'authenticated' AND 
      auth.jwt() ->> 'role' = 'editor'
    );

-- Analytics data can be inserted by authenticated users (for tracking)
CREATE POLICY "Authenticated users can insert analytics" ON state_analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==================================================
-- Helper Functions
-- ==================================================

-- Function to get current week based on journey start date
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

-- Function to automatically update state status based on week
CREATE OR REPLACE FUNCTION update_state_status()
RETURNS TRIGGER AS $$
DECLARE
  current_week INTEGER;
BEGIN
  current_week := get_current_journey_week();
  
  -- Only auto-update status if not manually overridden
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

-- Apply the status update trigger
CREATE TRIGGER state_status_update_trigger
    BEFORE INSERT OR UPDATE ON state_progress
    FOR EACH ROW EXECUTE FUNCTION update_state_status();

-- ==================================================
-- Sample Data Population
-- ==================================================
-- This would typically be run separately, but included for reference

-- Insert initial state progress data
INSERT INTO state_progress (
  state_code, state_name, week_number, region, description
) VALUES 
  ('AL', 'Alabama', 1, 'Southeast', 'Exploring Alabama''s emerging craft beer scene and BBQ pairings'),
  ('AK', 'Alaska', 2, 'West', 'Discovering unique brewing conditions in America''s last frontier'),
  ('AZ', 'Arizona', 3, 'Southwest', 'Desert brewing innovation and Southwestern flavors')
ON CONFLICT (state_code) DO NOTHING;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW map_interaction_summary;

-- ==================================================
-- Performance Optimizations
-- ==================================================

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_state_analytics_composite 
ON state_analytics(state_code, interaction_type, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_brewery_features_composite 
ON brewery_features(state_code, visit_priority, is_active);

-- Additional performance indexes for blog integration
CREATE INDEX IF NOT EXISTS idx_state_progress_blog_post_id ON state_progress(blog_post_id) WHERE blog_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_timestamp ON state_analytics(session_id, timestamp DESC);

-- Partial indexes for active/public records only
CREATE INDEX IF NOT EXISTS idx_brewery_features_active_priority ON brewery_features(state_code, visit_priority) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_journey_milestones_public_date ON journey_milestones(milestone_date DESC) WHERE is_public = true;

-- GIN indexes for array and JSONB fields
CREATE INDEX IF NOT EXISTS idx_state_progress_featured_breweries_gin ON state_progress USING GIN(featured_breweries);
CREATE INDEX IF NOT EXISTS idx_brewery_features_social_media_gin ON brewery_features USING GIN(social_media);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_metadata_gin ON journey_milestones USING GIN(metadata);

-- ==================================================
-- Comments and Documentation
-- ==================================================
-- ==================================================
-- Enhanced Performance Indexes (Supabase Specialist Recommendations)
-- ==================================================

-- Partial indexes for active/public records only (performance optimization)
CREATE INDEX IF NOT EXISTS idx_brewery_features_active ON brewery_features(state_code, visit_priority) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_journey_milestones_public ON journey_milestones(milestone_date DESC, celebration_level) 
WHERE is_public = true;

-- GIN indexes for array and JSONB searches
CREATE INDEX IF NOT EXISTS idx_state_progress_breweries_gin ON state_progress USING GIN(featured_breweries);
CREATE INDEX IF NOT EXISTS idx_state_progress_highlights_gin ON state_progress USING GIN(journey_highlights);
CREATE INDEX IF NOT EXISTS idx_brewery_features_styles_gin ON brewery_features USING GIN(specialty_styles);
CREATE INDEX IF NOT EXISTS idx_brewery_features_beers_gin ON brewery_features USING GIN(signature_beers);
CREATE INDEX IF NOT EXISTS idx_brewery_features_social_gin ON brewery_features USING GIN(social_media);
CREATE INDEX IF NOT EXISTS idx_state_analytics_metadata_gin ON state_analytics USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_metadata_gin ON journey_milestones USING GIN(metadata);

-- Blog integration indexes
CREATE INDEX IF NOT EXISTS idx_state_progress_blog_post ON state_progress(blog_post_id) WHERE blog_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_journey_milestones_blog_post ON journey_milestones(blog_post_id) WHERE blog_post_id IS NOT NULL;

-- ==================================================
-- Real-time Subscriptions Support
-- ==================================================

-- Enable realtime for state progress changes
ALTER PUBLICATION supabase_realtime ADD TABLE state_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_milestones;

-- ==================================================
-- Database Health Monitoring
-- ==================================================

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
        ('state_progress'), 
        ('state_analytics'), 
        ('brewery_features'), 
        ('journey_milestones')
      ) AS t(table_name)
    ),
    'record_counts', (
      SELECT jsonb_build_object(
        'state_progress', (SELECT count(*) FROM state_progress),
        'state_analytics', (SELECT count(*) FROM state_analytics),
        'brewery_features', (SELECT count(*) FROM brewery_features),
        'journey_milestones', (SELECT count(*) FROM journey_milestones)
      )
    ),
    'index_usage', (
      SELECT jsonb_object_agg(indexname, idx_scan)
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('state_progress', 'state_analytics', 'brewery_features', 'journey_milestones')
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

-- ==================================================
-- Analytics Aggregation Functions
-- ==================================================

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
      100.0 * COUNT(CASE WHEN sa.device_type = 'mobile' THEN 1 END) / COUNT(sa.id), 
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

-- ==================================================
-- Data Archival Strategy (Commented for future use)
-- ==================================================

/*
-- Partition analytics table by month for performance
-- Uncomment and modify dates as needed

CREATE TABLE state_analytics_2024_01 PARTITION OF state_analytics
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE state_analytics_2024_02 PARTITION OF state_analytics
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Add more partitions as needed
*/

-- ==================================================
-- Comments and Documentation
-- ==================================================
COMMENT ON TABLE state_progress IS 'Tracks completion status and progress for each state in the 50-state beer journey';
COMMENT ON TABLE state_analytics IS 'Captures user interactions with the interactive map for analytics and UX improvements';
COMMENT ON TABLE brewery_features IS 'Stores detailed information about featured breweries in each state';
COMMENT ON TABLE journey_milestones IS 'Records significant achievements and events throughout the journey';

COMMENT ON COLUMN state_progress.week_number IS 'Sequential week number (1-50) corresponding to state exploration schedule';
COMMENT ON COLUMN state_analytics.duration_ms IS 'Duration of interaction in milliseconds for engagement analysis';
COMMENT ON COLUMN brewery_features.visit_priority IS 'Priority ranking (1-10) for brewery visit recommendations';
COMMENT ON COLUMN journey_milestones.celebration_level IS 'Significance level for milestone celebrations and social media';

COMMENT ON FUNCTION get_database_health() IS 'Returns comprehensive database health metrics including table sizes, record counts, index usage, and connection stats';
COMMENT ON FUNCTION get_state_engagement_summary(INTEGER) IS 'Returns engagement analytics summary for all states within specified time period';

-- ==================================================
-- Audit Trail Table
-- ==================================================
CREATE TABLE IF NOT EXISTS state_progress_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_state_progress_audit_table_record ON state_progress_audit(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_state_progress_audit_changed_at ON state_progress_audit(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_state_progress_audit_changed_by ON state_progress_audit(changed_by);

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
    auth.uid()
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to key tables
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
-- Additional Utility Functions
-- ==================================================

-- Function to get journey statistics
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

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_state_progress_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY map_interaction_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;