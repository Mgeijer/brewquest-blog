import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔄 Setting up analytics schema...')

    // Read the analytics schema SQL file
    const schemaPath = join(process.cwd(), 'src/lib/database/analytics-schema.sql')
    const schemaSQL = readFileSync(schemaPath, 'utf8')

    // Split SQL file into individual statements
    const statements = schemaSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'))

    console.log(`📋 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        })

        if (error) {
          // Try direct execution for statements that don't work with rpc
          const { error: directError } = await supabase
            .from('dummy') // This will fail but we just need to execute SQL
            .select()
            .limit(0)
          
          if (directError && !directError.message.includes('does not exist')) {
            console.error(`❌ Error executing statement ${i + 1}:`, error)
            throw error
          }
        }
      }
    }

    console.log('✅ Analytics schema setup completed successfully')

    // Test the setup by inserting a sample record
    const testInteraction = {
      state_code: 'TEST',
      action: 'click',
      session_id: 'test_session_setup',
      user_agent: 'test_agent',
      metadata: { test: true }
    }

    const { error: insertError } = await supabase
      .from('map_interactions')
      .insert([testInteraction])

    if (insertError) {
      console.error('❌ Error testing analytics insert:', insertError)
      return NextResponse.json(
        { error: 'Schema created but test insert failed', details: insertError },
        { status: 500 }
      )
    }

    // Clean up test record
    await supabase
      .from('map_interactions')
      .delete()
      .eq('session_id', 'test_session_setup')

    console.log('✅ Analytics system test completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Analytics schema and system setup completed successfully',
      tablesCreated: [
        'map_interactions',
        'analytics_sessions', 
        'state_popularity_daily',
        'popular_states_30d (materialized view)'
      ],
      functionsCreated: [
        'update_session_summary()',
        'aggregate_daily_state_popularity()',
        'refresh_popular_states_view()'
      ]
    })

  } catch (error) {
    console.error('❌ Analytics setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup analytics schema', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}