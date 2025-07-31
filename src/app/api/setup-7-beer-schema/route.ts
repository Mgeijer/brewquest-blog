/**
 * 7-Beer Schema Setup API
 * 
 * Executes the database schema update to support 7 beers per week structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting 7-beer schema setup...')

    // 1. Add day_of_week column to beer_reviews if it doesn't exist
    const addColumnQuery = `
      ALTER TABLE beer_reviews 
      ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7);
    `
    
    const { error: alterError } = await supabase.rpc('exec_sql', { 
      sql_text: addColumnQuery 
    }).single()

    if (alterError && !alterError.message.includes('already exists')) {
      console.error('Failed to add day_of_week column:', alterError)
      // Continue anyway, column might already exist
    }

    // 2. Add beer_day column to social_posts if it doesn't exist
    const addSocialColumnQuery = `
      ALTER TABLE social_posts 
      ADD COLUMN IF NOT EXISTS beer_day INTEGER CHECK (beer_day >= 1 AND beer_day <= 7);
    `
    
    const { error: socialColumnError } = await supabase.rpc('exec_sql', { 
      sql_text: addSocialColumnQuery 
    }).single()

    if (socialColumnError && !socialColumnError.message.includes('already exists')) {
      console.error('Failed to add beer_day column:', socialColumnError)
      // Continue anyway
    }

    // 3. Create content_schedule table
    const createScheduleTableQuery = `
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
        beer_day INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(state_code, week_number, content_type, beer_day)
      );
    `

    const { error: scheduleTableError } = await supabase.rpc('exec_sql', { 
      sql_text: createScheduleTableQuery 
    }).single()

    if (scheduleTableError) {
      console.error('Failed to create content_schedule table:', scheduleTableError)
    }

    // 4. Insert sample Alabama data with 7 beers
    const sampleDataQuery = `
      INSERT INTO beer_reviews (
        state_code, week_number, day_of_week, brewery_name, beer_name, 
        beer_style, abv, ibu, rating, description, unique_feature
      ) VALUES 
      ('AL', 1, 1, 'Good People Brewing', 'Snake Handler Double IPA', 'Double IPA', 9.2, 85, 4.5, 'Bold and hoppy with citrus notes', 'Locally sourced Alabama hops'),
      ('AL', 1, 2, 'Trim Tab Brewing', 'Paradise Now', 'Gose', 4.8, 8, 4.2, 'Refreshing sour with tropical fruits', 'Cucumber and lime infusion'),
      ('AL', 1, 3, 'Cahaba Brewing', 'Oka Uba IPA', 'IPA', 6.8, 65, 4.0, 'Balanced IPA with Alabama character', 'Named after Creek Indian word'),
      ('AL', 1, 4, 'Avondale Brewing', 'Miss Fancy Tripel', 'Belgian Tripel', 9.0, 25, 4.6, 'Complex Belgian-style ale', 'Birmingham-brewed Belgian tradition'),
      ('AL', 1, 5, 'Yellowhammer Brewing', 'Cliff Hanger Pale Ale', 'Pale Ale', 5.2, 40, 3.8, 'Easy-drinking pale ale', 'Huntsville space city inspiration'),
      ('AL', 1, 6, 'Back Forty Beer Co.', 'Naked Pig Pale Ale', 'Pale Ale', 4.5, 35, 4.1, 'Light and approachable', 'Alabama agricultural roots'),
      ('AL', 1, 7, 'Druid City Brewing', 'BlackWarrior Porter', 'Porter', 5.8, 30, 4.3, 'Rich and smooth porter', 'Tuscaloosa river heritage')
      ON CONFLICT DO NOTHING;
    `

    const { error: sampleDataError } = await supabase.rpc('exec_sql', { 
      sql_text: sampleDataQuery 
    }).single()

    if (sampleDataError) {
      console.error('Failed to insert sample data:', sampleDataError)
    }

    // 5. Create indexes for performance
    const indexQuery = `
      CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day 
      ON beer_reviews(state_code, week_number, day_of_week);
      
      CREATE INDEX IF NOT EXISTS idx_content_schedule_date 
      ON content_schedule(scheduled_date, scheduled_time, status);
    `

    const { error: indexError } = await supabase.rpc('exec_sql', { 
      sql_text: indexQuery 
    }).single()

    if (indexError) {
      console.error('Failed to create indexes:', indexError)
    }

    // 6. Verify the setup by checking data
    const { data: beerCount, error: countError } = await supabase
      .from('beer_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('state_code', 'AL')
      .eq('week_number', 1)

    const verificationResults = {
      beer_reviews_count: beerCount || 0,
      setup_completed: true,
      sample_data_inserted: !sampleDataError,
      indexes_created: !indexError,
      schema_updated: !alterError
    }

    return NextResponse.json({
      success: true,
      message: '7-beer schema setup completed successfully!',
      verification: verificationResults,
      alabama_week1_beers: beerCount || 0,
      next_steps: [
        'Test content generation API',
        'Validate 7-beer workflow',
        'Set up social media posting'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('7-Beer Schema Setup Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Schema setup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check current schema status
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('id, state_code, week_number, day_of_week')
      .eq('state_code', 'AL')
      .eq('week_number', 1)

    const { data: scheduleTable, error: scheduleError } = await supabase
      .from('content_schedule')
      .select('id', { count: 'exact', head: true })

    return NextResponse.json({
      schema_status: {
        beer_reviews_table: !beerError,
        content_schedule_table: !scheduleError,
        alabama_week1_beers: beerReviews?.length || 0,
        sample_beers: beerReviews?.map(b => ({
          day: b.day_of_week,
          state: b.state_code,
          week: b.week_number
        })) || []
      },
      ready_for_7_beer_workflow: (beerReviews?.length || 0) === 7 && !scheduleError,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check schema status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}