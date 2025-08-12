import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/states/[stateCode]/published-beers
 * Returns only the beer reviews that have been published according to daily schedule
 * Works for any state with proper state code (AL, AK, AZ, etc.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { stateCode: string } }
) {
  try {
    const { stateCode } = params
    const normalizedStateCode = stateCode.toUpperCase()
    
    const supabase = createClient()
    
    // Get state information and blog post ID
    const { data: state, error: stateError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_code', normalizedStateCode)
      .single()

    if (stateError || !state) {
      return NextResponse.json({ 
        error: `State ${normalizedStateCode} not found`,
        state_code: normalizedStateCode 
      }, { status: 404 })
    }

    // Get only published beer reviews for this state
    const { data: publishedBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', state.blog_post_id)
      .not('published_at', 'is', null)
      .order('day_of_week', { ascending: true })

    if (beersError) {
      console.error(`Error fetching published ${normalizedStateCode} beers:`, beersError)
      return NextResponse.json({ 
        error: 'Failed to fetch published beers',
        details: beersError.message 
      }, { status: 500 })
    }

    // Also get the current day to provide context
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Convert Sunday to 7
    
    return NextResponse.json({
      success: true,
      state: state.state_name,
      state_code: normalizedStateCode,
      week: state.week_number,
      status: state.status,
      current_day: dayOfWeek,
      published_beers: publishedBeers || [],
      total_published: publishedBeers?.length || 0,
      total_expected: 7, // All states have 7 daily beers
      message: publishedBeers?.length === 0 ? 
        `No beers published yet for ${state.state_name}` : 
        `${publishedBeers?.length} of 7 beers published for ${state.state_name}`
    })

  } catch (error) {
    console.error(`Error in published beers API for ${params.stateCode}:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}