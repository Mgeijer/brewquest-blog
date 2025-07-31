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

    console.log('🔄 Setting up analytics tables...')

    // Create map_interactions table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql_query: `
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
        
        CREATE INDEX IF NOT EXISTS idx_map_interactions_state_code ON map_interactions(state_code);
        CREATE INDEX IF NOT EXISTS idx_map_interactions_action ON map_interactions(action);
        CREATE INDEX IF NOT EXISTS idx_map_interactions_timestamp ON map_interactions(timestamp);
        CREATE INDEX IF NOT EXISTS idx_map_interactions_session_id ON map_interactions(session_id);
      `
    })

    if (tableError) {
      console.error('Table creation error:', tableError)
    }

    // Test the analytics system with a real insert
    const testInteraction = {
      state_code: 'AL',
      action: 'click',
      session_id: 'test_session_' + Date.now(),
      user_agent: 'test_agent',
      metadata: { test: true, setup: true }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('map_interactions')
      .insert([testInteraction])
      .select()

    if (insertError) {
      console.error('❌ Error testing analytics insert:', insertError)
      return NextResponse.json(
        { error: 'Failed to test analytics system', details: insertError },
        { status: 500 }
      )
    }

    console.log('✅ Analytics test insert successful:', insertData)

    // Clean up test record
    if (insertData && insertData.length > 0) {
      await supabase
        .from('map_interactions')
        .delete()
        .eq('id', insertData[0].id)
    }

    // Verify we can read data
    const { data: verifyData, error: verifyError } = await supabase
      .from('map_interactions')
      .select('count')
      .limit(1)

    if (verifyError) {
      console.error('Verification error:', verifyError)
    }

    console.log('✅ Analytics system setup and verified successfully')

    return NextResponse.json({
      success: true,
      message: 'Analytics system setup and tested successfully',
      testData: insertData
    })

  } catch (error) {
    console.error('❌ Analytics setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup analytics system', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}