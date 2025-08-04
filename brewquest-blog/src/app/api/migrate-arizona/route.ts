import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'arizona-week3-supabase-migration.sql')
    
    if (!fs.existsSync(migrationPath)) {
      return NextResponse.json(
        { error: 'Migration file not found' },
        { status: 404 }
      )
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))

    let results = []
    let successCount = 0
    let errorCount = 0

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip comments and verification queries
      if (statement.includes('RAISE NOTICE') || 
          statement.includes('SELECT COUNT(*)') || 
          statement.includes('Show complete') ||
          statement.startsWith('DO $$')) {
        continue
      }

      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        })

        if (error) {
          console.error(`Error executing statement ${i}:`, error)
          errorCount++
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: false,
            error: error.message
          })
        } else {
          successCount++
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: true,
            data
          })
        }
      } catch (err) {
        console.error(`Exception executing statement ${i}:`, err)
        errorCount++
        results.push({
          statement: statement.substring(0, 100) + '...',
          success: false,
          error: err.message
        })
      }
    }

    // Verify the migration by checking inserted data
    const { data: breweries } = await supabase
      .from('breweries')
      .select('*')
      .ilike('location', '%Arizona%')

    const { data: beers } = await supabase
      .from('beers')
      .select('*, breweries(*)')
      .eq('breweries.location', 'ilike.%Arizona%')

    const { data: reviews } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state', 'Arizona')
      .eq('week_number', 3)

    return NextResponse.json({
      success: true,
      message: 'Arizona Week 3 migration executed',
      stats: {
        totalStatements: statements.length,
        successCount,
        errorCount,
        breweries: breweries?.length || 0,
        beers: beers?.length || 0,
        reviews: reviews?.length || 0
      },
      results: results.slice(0, 10), // Return first 10 results
      data: {
        breweries,
        beers,
        reviews
      }
    })

  } catch (error) {
    console.error('Migration execution failed:', error)
    return NextResponse.json(
      { error: 'Migration execution failed', details: error.message },
      { status: 500 }
    )
  }
}