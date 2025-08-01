import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { password } = await request.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert Alaska state_progress if missing
    const { data: alaskaInserted, error: alaskaError } = await supabase
      .from('state_progress')
      .upsert({
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        featured_breweries: [],
        featured_beers_count: 0,
        journey_highlights: ['Alaska brewing frontier', 'Extreme brewing conditions', 'Historical Gold Rush connections'],
        difficulty_rating: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'state_code',
        ignoreDuplicates: false
      })

    if (alaskaError) {
      console.error('Alaska state_progress error:', alaskaError)
      return NextResponse.json(
        { error: 'Failed to create Alaska state_progress', details: alaskaError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Alaska state_progress created successfully',
      inserted: alaskaInserted
    })

  } catch (error) {
    console.error('State progress setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup state progress', details: error.message },
      { status: 500 }
    )
  }
}