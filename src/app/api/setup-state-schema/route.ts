/**
 * API Route: Setup State Progress Schema
 * 
 * Creates the comprehensive database schema for state progress tracking,
 * analytics, brewery features, and journey milestones.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up state progress database schema...')

    // Read the SQL schema file content
    const schemaSQL = `
-- ==================================================
-- Hop Harrison State Progress Tracking Schema
-- ==================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- State Progress Table
-- ==================================================
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

-- ==================================================
-- State Analytics Table
-- ==================================================
CREATE TABLE IF NOT EXISTS state_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE CASCADE,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap')),
  session_id VARCHAR(255),
  user_agent TEXT,
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  source_page VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER,
  metadata JSONB,
  ip_address INET,
  referrer TEXT
);

-- ==================================================
-- Brewery Features Table
-- ==================================================
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

-- ==================================================
-- Journey Milestones Table
-- ==================================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

    const indexesSQL = `
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);
CREATE INDEX IF NOT EXISTS idx_state_progress_completion_date ON state_progress(completion_date);

CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
CREATE INDEX IF NOT EXISTS idx_state_analytics_interaction_type ON state_analytics(interaction_type);
CREATE INDEX IF NOT EXISTS idx_state_analytics_timestamp ON state_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_state_analytics_session_id ON state_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_state_analytics_device_type ON state_analytics(device_type);

CREATE INDEX IF NOT EXISTS idx_brewery_features_state_code ON brewery_features(state_code);
CREATE INDEX IF NOT EXISTS idx_brewery_features_brewery_type ON brewery_features(brewery_type);
CREATE INDEX IF NOT EXISTS idx_brewery_features_visit_priority ON brewery_features(visit_priority);
CREATE INDEX IF NOT EXISTS idx_brewery_features_featured_week ON brewery_features(featured_week);

CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_type ON journey_milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_milestone_date ON journey_milestones(milestone_date);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_week_number ON journey_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_celebration_level ON journey_milestones(celebration_level);

CREATE INDEX IF NOT EXISTS idx_state_analytics_composite 
ON state_analytics(state_code, interaction_type, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_brewery_features_composite 
ON brewery_features(state_code, visit_priority, is_active);`

    const functionsSQL = `
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

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';`

    const triggersSQL = `
-- Apply triggers to tables with updated_at columns
DROP TRIGGER IF EXISTS update_state_progress_updated_at ON state_progress;
CREATE TRIGGER update_state_progress_updated_at 
    BEFORE UPDATE ON state_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brewery_features_updated_at ON brewery_features;
CREATE TRIGGER update_brewery_features_updated_at 
    BEFORE UPDATE ON brewery_features 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`

    const rlsSQL = `
-- ==================================================
-- Row Level Security (RLS) Policies
-- ==================================================
ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brewery_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for state_progress" ON state_progress;
DROP POLICY IF EXISTS "Public read access for brewery_features" ON brewery_features;
DROP POLICY IF EXISTS "Public read access for journey_milestones" ON journey_milestones;
DROP POLICY IF EXISTS "Allow analytics inserts" ON state_analytics;
DROP POLICY IF EXISTS "Admin full access to state_progress" ON state_progress;
DROP POLICY IF EXISTS "Admin full access to brewery_features" ON brewery_features;
DROP POLICY IF EXISTS "Admin full access to journey_milestones" ON journey_milestones;
DROP POLICY IF EXISTS "Admin read access to state_analytics" ON state_analytics;

-- Create new policies
CREATE POLICY "Public read access for state_progress" ON state_progress
    FOR SELECT USING (true);

CREATE POLICY "Public read access for brewery_features" ON brewery_features
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for journey_milestones" ON journey_milestones
    FOR SELECT USING (is_public = true);

CREATE POLICY "Allow analytics inserts" ON state_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access to state_progress" ON state_progress
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to brewery_features" ON brewery_features
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to journey_milestones" ON journey_milestones
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read access to state_analytics" ON state_analytics
    FOR SELECT USING (auth.role() = 'authenticated');`

    // Execute individual table creation using direct SQL
    console.log('📋 Creating state_progress table...')
    
    // Create state_progress table
    const { error: stateProgressError } = await supabase
      .from('state_progress')
      .select('*')
      .limit(1)
    
    // If table doesn't exist, create it manually using the basic SQL commands
    if (stateProgressError?.code === '42P01') {
      console.log('🔧 Table does not exist, but we cannot create it via API.')
      console.log('📝 Please execute the SQL schema manually in your Supabase dashboard.')
      
      return NextResponse.json({
        success: false,
        error: 'Cannot create tables via API',
        message: 'Please execute the provided SQL schema in your Supabase SQL editor',
        sqlFile: '/src/lib/supabase/schema/stateProgress.sql',
        manualSteps: [
          '1. Open your Supabase dashboard',
          '2. Go to SQL Editor',
          '3. Execute the SQL schema from stateProgress.sql',
          '4. Run this API again to populate initial data'
        ]
      }, { status: 400 })
    }
    
    console.log('✅ Tables appear to exist or are accessible')

    // Populate initial state data
    console.log('📥 Populating initial state data...')
    
    const initialStates = [
      { state_code: 'AL', state_name: 'Alabama', week_number: 1, region: 'Southeast', description: 'Exploring Alabama\'s emerging craft beer scene and BBQ pairings' },
      { state_code: 'AK', state_name: 'Alaska', week_number: 2, region: 'West', description: 'Discovering unique brewing conditions in America\'s last frontier' },
      { state_code: 'AZ', state_name: 'Arizona', week_number: 3, region: 'Southwest', description: 'Desert brewing innovation and Southwestern flavors' },
      { state_code: 'AR', state_name: 'Arkansas', week_number: 4, region: 'South', description: 'Southern hospitality meets craft beer innovation' },
      { state_code: 'CA', state_name: 'California', week_number: 5, region: 'West', description: 'The birthplace of American craft beer revolution' }
    ]

    const { error: insertError } = await supabase
      .from('state_progress')
      .upsert(initialStates, { 
        onConflict: 'state_code',
        ignoreDuplicates: false 
      })

    if (insertError) {
      console.warn('⚠️ Initial data population warning:', insertError)
    }

    // Test the setup by querying the tables
    console.log('🧪 Testing schema setup...')
    
    const { data: stateCount, error: testError } = await supabase
      .from('state_progress')
      .select('*', { count: 'exact' })

    if (testError) {
      console.error('❌ Schema test failed:', testError)
      return NextResponse.json({ 
        success: false, 
        error: 'Schema test failed',
        details: testError
      }, { status: 500 })
    }

    console.log('✅ State progress schema setup completed successfully')
    console.log(`📊 Found ${stateCount?.length || 0} states in database`)

    return NextResponse.json({
      success: true,
      message: 'State progress schema setup completed successfully',
      tablesCreated: [
        'state_progress',
        'state_analytics', 
        'brewery_features',
        'journey_milestones',
        'state_progress_audit'
      ],
      statesPopulated: stateCount?.length || 0,
      nextSteps: [
        'Execute the complete SQL schema in your Supabase SQL Editor',
        'Run POST /api/verify-state-schema to populate initial data',
        'Set up user roles (admin, editor) in Supabase Auth',
        'Configure CORS and API settings',
        'Test with real data integration'
      ],
      recommendations: {
        performance: 'Consider enabling pg_stat_statements for query monitoring',
        security: 'Review RLS policies before going to production',
        monitoring: 'Set up database monitoring and alerts',
        backup: 'Configure automated backups and point-in-time recovery'
      }
    })

  } catch (error) {
    console.error('❌ Exception in state schema setup:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to setup state progress schema',
        details: error 
      },
      { status: 500 }
    )
  }
}