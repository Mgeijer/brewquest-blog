/**
 * API Route: Verify State Progress Schema
 * 
 * Verifies that the state progress schema has been properly set up
 * and populates initial data if tables exist.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verifying state progress schema...')

    const results = {
      tables: {} as Record<string, boolean>,
      data_counts: {} as Record<string, number>,
      functions: {} as Record<string, boolean>,
      errors: [] as string[]
    }

    // Check each table
    const tables = ['state_progress', 'state_analytics', 'brewery_features', 'journey_milestones']
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1)

        if (error) {
          results.tables[table] = false
          results.errors.push(`${table}: ${error.message}`)
        } else {
          results.tables[table] = true
          results.data_counts[table] = count || 0
        }
      } catch (err) {
        results.tables[table] = false
        results.errors.push(`${table}: Exception - ${err}`)
      }
    }

    // Check for helper functions
    try {
      const { data, error } = await supabase.rpc('get_current_journey_week')
      results.functions['get_current_journey_week'] = !error
      if (error) {
        results.errors.push(`get_current_journey_week: ${error.message}`)
      }
    } catch (err) {
      results.functions['get_current_journey_week'] = false
      results.errors.push(`get_current_journey_week: Exception - ${err}`)
    }

    const allTablesExist = Object.values(results.tables).every(exists => exists)
    const schema_ready = allTablesExist && results.functions['get_current_journey_week']

    console.log(`📊 Schema verification complete. Ready: ${schema_ready}`)

    return NextResponse.json({
      schema_ready,
      tables: results.tables,
      data_counts: results.data_counts,
      functions: results.functions,
      errors: results.errors,
      summary: {
        tables_created: Object.values(results.tables).filter(Boolean).length,
        total_tables: tables.length,
        total_records: Object.values(results.data_counts).reduce((sum, count) => sum + count, 0)
      }
    })

  } catch (error) {
    console.error('❌ Exception in schema verification:', error)
    return NextResponse.json(
      { 
        schema_ready: false,
        error: 'Failed to verify schema',
        details: error 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Populating initial state progress data...')

    // First verify the schema exists
    const verifyResponse = await GET(request)
    const verifyData = await verifyResponse.json()

    if (!verifyData.schema_ready) {
      return NextResponse.json({
        success: false,
        error: 'Schema not ready',
        message: 'Please execute the SQL schema first',
        schema_status: verifyData
      }, { status: 400 })
    }

    // Populate initial state data
    const initialStates = [
      { 
        state_code: 'AL', 
        state_name: 'Alabama', 
        week_number: 1, 
        region: 'Southeast', 
        description: 'Exploring Alabama\'s emerging craft beer scene and BBQ pairings',
        featured_breweries: ['Good People Brewing Company', 'Trim Tab Brewing', 'Avondale Brewing Company'],
        total_breweries: 15,
        featured_beers_count: 7
      },
      { 
        state_code: 'AK', 
        state_name: 'Alaska', 
        week_number: 2, 
        region: 'West', 
        description: 'Discovering unique brewing conditions in America\'s last frontier',
        featured_breweries: ['Alaskan Brewing Company', 'Midnight Sun Brewing', 'Denali Brewing Company'],
        total_breweries: 12,
        featured_beers_count: 7
      },
      { 
        state_code: 'AZ', 
        state_name: 'Arizona', 
        week_number: 3, 
        region: 'Southwest', 
        description: 'Desert brewing innovation and Southwestern flavors',
        featured_breweries: ['Four Peaks Brewing', 'Brewery X', 'Grand Canyon Brewing'],
        total_breweries: 25,
        featured_beers_count: 7
      },
      { 
        state_code: 'AR', 
        state_name: 'Arkansas', 
        week_number: 4, 
        region: 'South', 
        description: 'Southern hospitality meets craft beer innovation',
        featured_breweries: ['Lost Forty Brewing', 'Diamond Bear Brewing', 'Fossil Cove Brewing'],
        total_breweries: 18,
        featured_beers_count: 7
      },
      { 
        state_code: 'CA', 
        state_name: 'California', 
        week_number: 5, 
        region: 'West', 
        description: 'The birthplace of American craft beer revolution',
        featured_breweries: ['Sierra Nevada', 'Russian River Brewing', 'Stone Brewing'],
        total_breweries: 150,
        featured_beers_count: 7
      }
    ]

    const { data: insertedStates, error: insertError } = await supabase
      .from('state_progress')
      .upsert(initialStates, { 
        onConflict: 'state_code',
        ignoreDuplicates: false 
      })
      .select()

    if (insertError) {
      console.error('❌ Error inserting initial states:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Failed to populate initial data',
        details: insertError
      }, { status: 500 })
    }

    // Create a welcome milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('journey_milestones')
      .insert({
        milestone_type: 'technical_milestone',
        title: 'State Progress Schema Initialized',
        description: 'Successfully set up the comprehensive state progress tracking system for the 50-state beer journey.',
        celebration_level: 'major',
        social_media_posted: false,
        is_public: true,
        metadata: {
          tables_created: 4,
          initial_states: initialStates.length,
          setup_date: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (milestoneError) {
      console.warn('⚠️ Could not create initialization milestone:', milestoneError)
    }

    console.log('✅ Initial state data populated successfully')

    return NextResponse.json({
      success: true,
      message: 'State progress schema initialized successfully',
      data: {
        states_created: insertedStates?.length || 0,
        milestone_created: !milestoneError,
        states: insertedStates
      }
    })

  } catch (error) {
    console.error('❌ Exception in initial data population:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to populate initial data',
        details: error 
      },
      { status: 500 }
    )
  }
}