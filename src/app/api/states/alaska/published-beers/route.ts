import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/states/alaska/published-beers
 * Returns only the beer reviews that have been published according to daily schedule
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get Alaska state and blog post ID
    const { data: alaskaState, error: stateError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_code', 'AK')
      .single()

    if (stateError || !alaskaState) {
      return NextResponse.json({ error: 'Alaska state not found' }, { status: 404 })
    }

    // Get only published beer reviews for Alaska
    const { data: publishedBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', alaskaState.blog_post_id)
      .not('published_at', 'is', null)
      .order('day_of_week', { ascending: true })

    if (beersError) {
      console.error('Error fetching published Alaska beers:', beersError)
      return NextResponse.json({ error: 'Failed to fetch published beers' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      state: alaskaState.state_name,
      week: alaskaState.week_number,
      published_beers: publishedBeers || [],
      total_published: publishedBeers?.length || 0,
      message: publishedBeers?.length === 0 ? 'No beers published yet' : `${publishedBeers?.length} beers published`
    })

  } catch (error) {
    console.error('Error in published beers API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}