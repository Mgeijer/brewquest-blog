/**
 * API Route: Comprehensive Database Setup
 * 
 * Sets up the complete Supabase database schema for the Hop Harrison beer blog,
 * including all tables, indexes, RLS policies, triggers, and initial data.
 * 
 * This endpoint handles the full database setup in a safe, idempotent manner.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { action = 'full_setup', force = false } = await request.json()
    
    console.log(`🚀 Starting database setup: ${action}`)
    
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const results = {
      success: true,
      action,
      timestamp: new Date().toISOString(),
      operations: [] as Array<{
        operation: string
        success: boolean
        message: string
        error?: any
      }>
    }

    // Helper function to execute SQL and track results
    const executeSQLSection = async (
      sectionName: string, 
      sql: string, 
      description: string
    ) => {
      try {
        console.log(`📋 Executing: ${description}`)
        const { error } = await supabase.rpc('exec_sql', { sql_text: sql })
        
        if (error) {
          console.error(`❌ Error in ${sectionName}:`, error)
          results.operations.push({
            operation: sectionName,
            success: false,
            message: description,
            error: error
          })
          return false
        } else {
          console.log(`✅ Completed: ${description}`)
          results.operations.push({
            operation: sectionName,
            success: true,
            message: description
          })
          return true
        }
      } catch (err) {
        console.error(`❌ Exception in ${sectionName}:`, err)
        results.operations.push({
          operation: sectionName,
          success: false,
          message: description,
          error: err
        })
        return false
      }
    }

    // Check if database is already set up (unless force is true)
    if (!force) {
      const { data: existingTables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['blog_posts', 'beer_reviews', 'state_progress', 'social_posts'])
      
      if (existingTables && existingTables.length >= 4) {
        console.log('⚠️ Database appears to already be set up. Use force=true to recreate.')
        return NextResponse.json({
          success: false,
          message: 'Database already appears to be set up. Use force=true to recreate.',
          existing_tables: existingTables.map(t => t.table_name)
        }, { status: 400 })
      }
    }

    if (action === 'full_setup' || action === 'extensions') {
      // 1. Extensions and Basic Setup
      await executeSQLSection(
        'extensions',
        `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `,
        'Setting up database extensions'
      )
    }

    if (action === 'full_setup' || action === 'core_tables') {
      // 2. Core Blog Tables
      await executeSQLSection(
        'blog_posts_table',
        `
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
          author_id UUID
        );
        `,
        'Creating blog_posts table'
      )

      await executeSQLSection(
        'beer_reviews_table',
        `
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
          brewery_type VARCHAR(50) CHECK (brewery_type IN ('microbrewery', 'brewpub', 'large', 'regional', 'contract', 'proprietor')),
          brewery_founded_year INTEGER,
          price_point VARCHAR(20) CHECK (price_point IN ('budget', 'moderate', 'premium', 'luxury')),
          availability VARCHAR(50) CHECK (availability IN ('year_round', 'seasonal', 'limited', 'one_off')),
          food_pairings TEXT[],
          alcohol_content_category VARCHAR(20) CHECK (alcohol_content_category IN ('session', 'standard', 'strong', 'imperial'))
        );
        `,
        'Creating beer_reviews table'
      )

      await executeSQLSection(
        'state_progress_table',
        `
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
          social_posts_generated INTEGER DEFAULT 0,
          engagement_score DECIMAL(5,2) DEFAULT 0,
          visit_planned BOOLEAN DEFAULT FALSE,
          visit_completed BOOLEAN DEFAULT FALSE,
          visit_date TIMESTAMP WITH TIME ZONE
        );
        `,
        'Creating state_progress table'
      )
    }

    if (action === 'full_setup' || action === 'social_tables') {
      // 3. Social Media Tables
      await executeSQLSection(
        'social_posts_table',
        `
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
          post_url TEXT,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed', 'archived')),
          engagement_metrics JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          target_audience VARCHAR(50),
          geo_targeting VARCHAR(100),
          promotion_budget DECIMAL(8,2),
          campaign_id VARCHAR(100),
          cross_post_to TEXT[],
          approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_revision'))
        );
        `,
        'Creating social_posts table'
      )

      await executeSQLSection(
        'social_campaigns_table',
        `
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
        `,
        'Creating social_campaigns table'
      )
    }

    if (action === 'full_setup' || action === 'newsletter_tables') {
      // 4. Newsletter Tables
      await executeSQLSection(
        'newsletter_subscribers_table',
        `
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
          subscription_source VARCHAR(50),
          tags TEXT[],
          last_email_opened TIMESTAMP WITH TIME ZONE,
          total_emails_opened INTEGER DEFAULT 0,
          total_emails_sent INTEGER DEFAULT 0,
          engagement_score DECIMAL(5,2) DEFAULT 0,
          preferred_content_types TEXT[],
          geographic_region VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        `,
        'Creating newsletter_subscribers table'
      )

      await executeSQLSection(
        'newsletter_campaigns_table',
        `
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
        `,
        'Creating newsletter_campaigns table'
      )
    }

    if (action === 'full_setup' || action === 'analytics_tables') {
      // 5. Analytics Tables
      await executeSQLSection(
        'page_analytics_table',
        `
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
          time_on_page INTEGER,
          bounce BOOLEAN DEFAULT FALSE,
          conversion_event VARCHAR(100),
          blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
          beer_review_id UUID REFERENCES beer_reviews(id) ON DELETE SET NULL,
          state_code VARCHAR(2) REFERENCES state_progress(state_code) ON DELETE SET NULL
        );
        `,
        'Creating page_analytics table'
      )

      await executeSQLSection(
        'state_analytics_table',
        `
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
          user_id UUID
        );
        `,
        'Creating state_analytics table'
      )

      await executeSQLSection(
        'map_interactions_table',
        `
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
        `,
        'Creating map_interactions table'
      )
    }

    if (action === 'full_setup' || action === 'extended_tables') {
      // 6. Extended Tables
      await executeSQLSection(
        'brewery_features_table',
        `
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
        `,
        'Creating brewery_features table'
      )

      await executeSQLSection(
        'journey_milestones_table',
        `
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
          social_engagement_count INTEGER DEFAULT 0,
          newsletter_featured BOOLEAN DEFAULT FALSE,
          press_coverage TEXT[],
          community_reaction_score DECIMAL(3,1)
        );
        `,
        'Creating journey_milestones table'
      )
    }

    if (action === 'full_setup' || action === 'indexes') {
      // 7. Create Critical Indexes
      await executeSQLSection(
        'core_indexes',
        `
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
        
        -- State Progress Indexes
        CREATE INDEX IF NOT EXISTS idx_state_progress_status ON state_progress(status);
        CREATE INDEX IF NOT EXISTS idx_state_progress_week_number ON state_progress(week_number);
        CREATE INDEX IF NOT EXISTS idx_state_progress_region ON state_progress(region);
        
        -- Social Posts Indexes
        CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
        CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
        CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_time ON social_posts(scheduled_time);
        
        -- Analytics Indexes
        CREATE INDEX IF NOT EXISTS idx_page_analytics_timestamp ON page_analytics(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_state_analytics_state_code ON state_analytics(state_code);
        CREATE INDEX IF NOT EXISTS idx_map_interactions_state_code ON map_interactions(state_code);
        `,
        'Creating essential database indexes'
      )
    }

    if (action === 'full_setup' || action === 'rls_policies') {
      // 8. Row Level Security
      await executeSQLSection(
        'enable_rls',
        `
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
        `,
        'Enabling Row Level Security'
      )

      await executeSQLSection(
        'public_read_policies',
        `
        -- Public Read Policies
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
        `,
        'Creating public read policies'
      )

      await executeSQLSection(
        'analytics_policies',
        `
        -- Analytics Insert Policies
        CREATE POLICY "Allow analytics inserts" ON page_analytics
          FOR INSERT WITH CHECK (true);
          
        CREATE POLICY "Allow state analytics inserts" ON state_analytics
          FOR INSERT WITH CHECK (true);
          
        CREATE POLICY "Allow map interaction inserts" ON map_interactions
          FOR INSERT WITH CHECK (true);
        `,
        'Creating analytics tracking policies'
      )
    }

    if (action === 'full_setup' || action === 'triggers') {
      // 9. Triggers and Functions
      await executeSQLSection(
        'update_trigger_function',
        `
        -- Updated At Trigger Function
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `,
        'Creating update timestamp trigger function'
      )

      await executeSQLSection(
        'apply_update_triggers',
        `
        -- Apply Updated At Triggers
        DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
        CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          
        DROP TRIGGER IF EXISTS update_beer_reviews_updated_at ON beer_reviews;
        CREATE TRIGGER update_beer_reviews_updated_at BEFORE UPDATE ON beer_reviews 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          
        DROP TRIGGER IF EXISTS update_state_progress_updated_at ON state_progress;
        CREATE TRIGGER update_state_progress_updated_at BEFORE UPDATE ON state_progress 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          
        DROP TRIGGER IF EXISTS update_social_posts_updated_at ON social_posts;
        CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `,
        'Applying update timestamp triggers'
      )

      await executeSQLSection(
        'journey_functions',
        `
        -- Journey Week Calculator Function
        CREATE OR REPLACE FUNCTION get_current_journey_week()
        RETURNS INTEGER AS $$
        DECLARE
          start_date DATE := '2024-01-01';
          current_week INTEGER;
        BEGIN
          current_week := CEIL(EXTRACT(EPOCH FROM (NOW() - start_date)) / (7 * 24 * 60 * 60))::INTEGER;
          RETURN LEAST(GREATEST(current_week, 1), 50);
        END;
        $$ LANGUAGE plpgsql;
        `,
        'Creating journey calculation functions'
      )
    }

    if (action === 'full_setup' || action === 'utility_functions') {
      // 10. Utility Functions
      await executeSQLSection(
        'health_function',
        `
        -- Database Health Function
        CREATE OR REPLACE FUNCTION get_database_health()
        RETURNS JSONB AS $$
        DECLARE
          result JSONB;
        BEGIN
          SELECT jsonb_build_object(
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
            'last_updated', NOW()
          ) INTO result;
          
          RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `,
        'Creating database health monitoring function'
      )

      await executeSQLSection(
        'journey_stats_function',
        `
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
            'completion_percentage', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2),
            'total_blog_posts', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published'),
            'total_beer_reviews', (SELECT COUNT(*) FROM beer_reviews),
            'total_social_posts', (SELECT COUNT(*) FROM social_posts WHERE status = 'posted'),
            'newsletter_subscribers', (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true)
          ) INTO stats
          FROM state_progress;
          
          RETURN stats;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `,
        'Creating journey statistics function'
      )
    }

    if (action === 'full_setup' || action === 'realtime') {
      // 11. Real-time Subscriptions
      await executeSQLSection(
        'realtime_setup',
        `
        -- Enable realtime for key tables
        ALTER PUBLICATION supabase_realtime ADD TABLE state_progress;
        ALTER PUBLICATION supabase_realtime ADD TABLE journey_milestones;
        ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;
        ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
        `,
        'Enabling real-time subscriptions'
      )
    }

    if (action === 'full_setup' || action === 'sample_data') {
      // 12. Sample Data
      await executeSQLSection(
        'sample_state_data',
        `
        -- Insert sample state progress data
        INSERT INTO state_progress (
          state_code, state_name, week_number, region, description
        ) VALUES 
          ('AL', 'Alabama', 1, 'Southeast', 'Exploring Alabama''s emerging craft beer scene and BBQ pairings'),
          ('AK', 'Alaska', 2, 'West', 'Discovering unique brewing conditions in America''s last frontier'),
          ('AZ', 'Arizona', 3, 'Southwest', 'Desert brewing innovation and Southwestern flavors'),
          ('AR', 'Arkansas', 4, 'Southeast', 'Natural State''s growing craft beer culture'),
          ('CA', 'California', 5, 'West', 'The birthplace of American craft brewing')
        ON CONFLICT (state_code) DO NOTHING;
        `,
        'Inserting sample state data'
      )
    }

    // Final verification
    const { data: finalTableCheck } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'blog_posts', 'beer_reviews', 'state_progress', 'social_posts',
        'newsletter_subscribers', 'page_analytics', 'state_analytics'
      ])

    const successfulOps = results.operations.filter(op => op.success).length
    const totalOps = results.operations.length
    
    results.success = successfulOps === totalOps
    
    console.log(`🎉 Database setup completed: ${successfulOps}/${totalOps} operations successful`)

    return NextResponse.json({
      ...results,
      final_verification: {
        tables_created: finalTableCheck?.length || 0,
        expected_tables: 7,
        setup_complete: (finalTableCheck?.length || 0) >= 7
      },
      summary: {
        total_operations: totalOps,
        successful_operations: successfulOps,
        failed_operations: totalOps - successfulOps,
        overall_success: results.success
      }
    })

  } catch (error) {
    console.error('❌ Exception in database setup:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to set up database',
        details: error 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Quick database status check
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    const expectedTables = [
      'blog_posts', 'beer_reviews', 'state_progress', 'social_posts',
      'social_campaigns', 'newsletter_subscribers', 'newsletter_campaigns',
      'page_analytics', 'state_analytics', 'map_interactions',
      'brewery_features', 'journey_milestones'
    ]

    const existingTables = tables?.map(t => t.table_name) || []
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))

    return NextResponse.json({
      database_status: {
        total_tables: existingTables.length,
        expected_tables: expectedTables.length,
        missing_tables: missingTables,
        setup_complete: missingTables.length === 0,
        setup_percentage: Math.round((existingTables.length / expectedTables.length) * 100)
      },
      available_actions: [
        'full_setup', 'extensions', 'core_tables', 'social_tables',
        'newsletter_tables', 'analytics_tables', 'extended_tables',
        'indexes', 'rls_policies', 'triggers', 'utility_functions',
        'realtime', 'sample_data'
      ]
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check database status', details: error },
      { status: 500 }
    )
  }
}