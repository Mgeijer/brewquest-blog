import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

    console.log('🔄 Adding analytics table to existing schema...')

    // First check if the table already exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'map_interactions')

    if (checkError) {
      console.log('Could not check existing tables:', checkError)
    }

    if (existingTables && existingTables.length > 0) {
      console.log('✅ map_interactions table already exists')
      return NextResponse.json({
        success: true,
        message: 'Analytics table already exists',
        tableExists: true
      })
    }

    // Use SQL query via the Edge Function or direct RPC
    const createTableQuery = `
      -- Create analytics table
      CREATE TABLE IF NOT EXISTS map_interactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        state_code VARCHAR(2) NOT NULL,
        action VARCHAR(50) NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        user_agent TEXT,
        session_id VARCHAR(100) NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_map_interactions_state_code ON map_interactions(state_code);
      CREATE INDEX IF NOT EXISTS idx_map_interactions_action ON map_interactions(action);
      CREATE INDEX IF NOT EXISTS idx_map_interactions_timestamp ON map_interactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_map_interactions_session_id ON map_interactions(session_id);

      -- Enable RLS
      ALTER TABLE map_interactions ENABLE ROW LEVEL SECURITY;

      -- Create policy for read access
      CREATE POLICY "Analytics read access" ON map_interactions
        FOR SELECT USING (true);

      -- Create policy for insert access
      CREATE POLICY "Analytics insert access" ON map_interactions
        FOR INSERT WITH CHECK (true);
    `

    // Since direct SQL execution isn't working, let's manually insert a record to effectively "create" the table structure
    // This is a workaround - we'll create the table through the first insert
    try {
      // Try to insert a test record - this will fail if table doesn't exist, which is what we want
      const { error: testError } = await supabase
        .from('map_interactions')
        .select('count')
        .limit(1)

      if (testError && testError.message.includes('does not exist')) {
        // Table doesn't exist, we need to create it via Supabase dashboard or direct SQL
        console.log('❌ Table does not exist and cannot be created via API')
        
        return NextResponse.json({
          success: false,
          message: 'Analytics table needs to be created manually in Supabase dashboard',
          instructions: {
            step1: 'Go to Supabase dashboard > SQL Editor',
            step2: 'Run the following SQL:',
            sql: createTableQuery
          }
        })
      }

      if (testError) {
        console.error('Other error:', testError)
        throw testError
      }

      console.log('✅ Table exists and is accessible')
      
    } catch (error) {
      console.log('Table creation attempt via error handling...')
    }

    // Test with a sample insert
    const testInteraction = {
      state_code: 'TEST',
      action: 'click',
      session_id: 'test_session_' + Date.now(),
      user_agent: 'test_agent',
      metadata: { test: true }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('map_interactions')
      .insert([testInteraction])
      .select()

    if (insertError) {
      console.error('❌ Test insert failed:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Table may not exist or lacks proper permissions',
        details: insertError,
        recommendation: 'Create the table manually in Supabase dashboard with the provided SQL'
      })
    }

    console.log('✅ Analytics table is working! Test insert successful:', insertData)

    // Clean up test record
    if (insertData && insertData.length > 0) {
      await supabase
        .from('map_interactions')
        .delete()
        .eq('id', insertData[0].id)
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics table is working correctly',
      testData: insertData
    })

  } catch (error) {
    console.error('❌ Analytics table setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup analytics table', 
        details: error instanceof Error ? error.message : 'Unknown error',
        sqlToRun: `
          CREATE TABLE IF NOT EXISTS map_interactions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            state_code VARCHAR(2) NOT NULL,
            action VARCHAR(50) NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
            user_agent TEXT,
            session_id VARCHAR(100) NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      },
      { status: 500 }
    )
  }
}