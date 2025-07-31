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

    console.log('🧪 Testing analytics system...')

    // Test analytics data insertion
    const testInteraction = {
      state_code: 'AL',
      action: 'click',
      session_id: 'test_session_' + Date.now(),
      user_agent: 'Mozilla/5.0 (test)',
      metadata: { 
        test: true, 
        timestamp: new Date().toISOString(),
        status: 'completed',
        stateName: 'Alabama'
      }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('map_interactions')
      .insert([testInteraction])
      .select()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to insert test data', details: insertError },
        { status: 500 }
      )
    }

    console.log('✅ Analytics insert successful:', insertData)

    // Test reading analytics data
    const { data: readData, error: readError } = await supabase
      .from('map_interactions')
      .select('*')
      .limit(5)
      .order('created_at', { ascending: false })

    if (readError) {
      console.error('❌ Read error:', readError)
      return NextResponse.json(
        { error: 'Failed to read analytics data', details: readError },
        { status: 500 }
      )
    }

    console.log('✅ Analytics read successful, found', readData?.length, 'records')

    // Test analytics aggregation
    const { data: aggregateData, error: aggregateError } = await supabase
      .from('map_interactions')
      .select('state_code, action')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (aggregateError) {
      console.error('❌ Aggregate error:', aggregateError)
    } else {
      console.log('✅ Analytics aggregation successful, found', aggregateData?.length, 'recent records')
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics system working correctly',
      testInsert: insertData,
      recentData: readData,
      aggregateCount: aggregateData?.length || 0
    })

  } catch (error) {
    console.error('❌ Analytics test failed:', error)
    return NextResponse.json(
      { 
        error: 'Analytics test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}