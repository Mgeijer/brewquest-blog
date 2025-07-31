import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for schema operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { action, confirm } = await request.json()
    
    if (action !== 'migrate-beer-reviews-schema') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }

    if (!confirm) {
      return NextResponse.json(
        { success: false, message: 'Migration must be explicitly confirmed' },
        { status: 400 }
      )
    }

    console.log('🔄 Starting beer_reviews schema migration...')

    // Migration SQL - adding missing columns and constraints
    const migrationSteps = [
      // Add missing columns
      `ALTER TABLE beer_reviews 
       ADD COLUMN IF NOT EXISTS state_code VARCHAR(2),
       ADD COLUMN IF NOT EXISTS state_name VARCHAR(100),
       ADD COLUMN IF NOT EXISTS week_number INTEGER,
       ADD COLUMN IF NOT EXISTS ibu INTEGER,
       ADD COLUMN IF NOT EXISTS description TEXT,
       ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
      
      // Add performance indexes
      `CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);`,
      `CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);`,
      `CREATE INDEX IF NOT EXISTS idx_beer_reviews_day_of_week ON beer_reviews(day_of_week);`,
      `CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);`,
      
      // Add data integrity constraints
      `ALTER TABLE beer_reviews 
       ADD CONSTRAINT IF NOT EXISTS chk_week_number CHECK (week_number >= 1 AND week_number <= 50);`,
      
      `ALTER TABLE beer_reviews 
       ADD CONSTRAINT IF NOT EXISTS chk_day_of_week CHECK (day_of_week >= 1 AND day_of_week <= 7);`,
      
      `ALTER TABLE beer_reviews 
       ADD CONSTRAINT IF NOT EXISTS chk_rating CHECK (rating >= 0 AND rating <= 5);`,
    ]

    const results = []
    
    for (let i = 0; i < migrationSteps.length; i++) {
      const step = migrationSteps[i]
      console.log(`📝 Executing migration step ${i + 1}/${migrationSteps.length}...`)
      
      const { data, error } = await supabase.rpc('exec_sql', { sql: step })
      
      if (error) {
        console.error(`❌ Migration step ${i + 1} failed:`, error)
        results.push({
          step: i + 1,
          success: false,
          error: error.message,
          sql: step.substring(0, 100) + '...'
        })
        
        // Continue with other steps even if one fails
        continue
      }
      
      console.log(`✅ Migration step ${i + 1} completed successfully`)
      results.push({
        step: i + 1,
        success: true,
        sql: step.substring(0, 100) + '...'
      })
    }

    // Create the updated_at trigger function and trigger
    const triggerFunction = `
      CREATE OR REPLACE FUNCTION update_beer_reviews_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `

    const triggerCreation = `
      DROP TRIGGER IF EXISTS trigger_beer_reviews_updated_at ON beer_reviews;
      CREATE TRIGGER trigger_beer_reviews_updated_at
          BEFORE UPDATE ON beer_reviews
          FOR EACH ROW
          EXECUTE FUNCTION update_beer_reviews_updated_at();
    `

    // Execute trigger function creation
    const { error: funcError } = await supabase.rpc('exec_sql', { sql: triggerFunction })
    if (!funcError) {
      console.log('✅ Updated trigger function created')
      results.push({ step: 'trigger_function', success: true })
    } else {
      console.error('❌ Trigger function creation failed:', funcError)
      results.push({ step: 'trigger_function', success: false, error: funcError.message })
    }

    // Execute trigger creation
    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: triggerCreation })
    if (!triggerError) {
      console.log('✅ Updated trigger created')
      results.push({ step: 'trigger_creation', success: true })
    } else {
      console.error('❌ Trigger creation failed:', triggerError)
      results.push({ step: 'trigger_creation', success: false, error: triggerError.message })
    }

    const successCount = results.filter(r => r.success).length
    const totalSteps = results.length

    console.log(`🎉 Migration completed: ${successCount}/${totalSteps} steps successful`)

    return NextResponse.json({
      success: successCount === totalSteps,
      message: `Schema migration completed: ${successCount}/${totalSteps} steps successful`,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Schema migration failed:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Schema migration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check current schema structure
    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(0) // Just get schema, no data

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to inspect schema',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Schema migration API ready',
      currentSchema: {
        table: 'beer_reviews',
        note: 'Use POST with action: "migrate-beer-reviews-schema" and confirm: true to execute migration'
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Service unavailable' },
      { status: 500 }
    )
  }
}