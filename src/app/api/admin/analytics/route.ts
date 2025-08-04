import { NextRequest, NextResponse } from 'next/server'
import { posthogServer, trackServerAPICall } from '@/lib/analytics/posthog-server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    
    // Calculate date range
    const now = new Date()
    const daysAgo = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
    
    // In a real implementation, you'd fetch this data from PostHog API
    // For now, we'll return mock data and some real data from Supabase
    
    // Get newsletter stats from Supabase
    const { data: newsletterData, error: newsletterError } = await supabase
      .from('newsletter_subscribers')
      .select('email, created_at, source')
      .gte('created_at', startDate.toISOString())
    
    const newsletterSignups = newsletterData?.length || 0
    const newsletterSources = newsletterData?.reduce((acc: any, sub) => {
      const source = sub.source || 'unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {}) || {}
    
    // Get state progress for map interactions
    const { data: stateData } = await supabase
      .from('state_progress')
      .select('state_code, state_name, status, week_number')
    
    // Get beer reviews for top beers
    const { data: beerData } = await supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating, state_name')
      .order('rating', { ascending: false })
      .limit(10)
    
    // Mock analytics data (in production, fetch from PostHog API)
    const analyticsData = {
      pageViews: generateMockPageViews(daysAgo),
      topStates: generateMockStateViews(stateData || []),
      topBeers: (beerData || []).map((beer, index) => ({
        name: beer.beer_name,
        brewery: beer.brewery_name,
        views: Math.floor(Math.random() * 1000) + 100,
        ratings: Math.floor(Math.random() * 50) + 10
      })),
      userEngagement: [
        { event: 'Beer Views', count: 2840, percentage: 35 },
        { event: 'State Exploration', count: 1920, percentage: 24 },
        { event: 'Map Interactions', count: 1440, percentage: 18 },
        { event: 'Newsletter Signups', count: 960, percentage: 12 },
        { event: 'Social Shares', count: 880, percentage: 11 }
      ],
      newsletterStats: {
        signups: newsletterSignups,
        conversion_rate: Math.random() * 5 + 2, // Mock conversion rate
        sources: Object.entries(newsletterSources).map(([source, count]) => ({
          source,
          count: count as number
        }))
      },
      mapInteractions: generateMockMapInteractions(stateData || []),
      performanceMetrics: {
        avg_load_time: Math.random() * 2 + 1,
        avg_tti: Math.random() * 3 + 2,
        bounce_rate: Math.random() * 30 + 20
      },
      realtimeUsers: Math.floor(Math.random() * 50) + 10
    }
    
    // Track API call
    await trackServerAPICall({
      endpoint: '/api/admin/analytics',
      method: 'GET',
      response_time: Date.now() - startTime,
      status_code: 200,
      user_agent: request.headers.get('user-agent') || undefined
    })
    
    return NextResponse.json(analyticsData)
    
  } catch (error: any) {
    console.error('Analytics API error:', error)
    
    // Track API error
    await trackServerAPICall({
      endpoint: '/api/admin/analytics',
      method: 'GET',
      response_time: Date.now() - startTime,
      status_code: 500,
      error_message: error.message,
      user_agent: request.headers.get('user-agent') || undefined
    })
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// Helper functions to generate mock data
function generateMockPageViews(days: number) {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 500) + 200,
      unique_users: Math.floor(Math.random() * 300) + 100
    })
  }
  
  return data
}

function generateMockStateViews(states: any[]) {
  const stateViews = states.map(state => ({
    state: state.state_name || state.state_code,
    views: Math.floor(Math.random() * 200) + 50,
    engagement_time: Math.floor(Math.random() * 300) + 60
  }))
  
  // Add some default states if no data
  if (stateViews.length === 0) {
    return [
      { state: 'California', views: 345, engagement_time: 180 },
      { state: 'Texas', views: 298, engagement_time: 165 },
      { state: 'New York', views: 267, engagement_time: 145 },
      { state: 'Florida', views: 234, engagement_time: 190 },
      { state: 'Colorado', views: 201, engagement_time: 220 }
    ]
  }
  
  return stateViews.sort((a, b) => b.views - a.views).slice(0, 10)
}

function generateMockMapInteractions(states: any[]) {
  return states.slice(0, 10).map(state => ({
    state: state.state_name || state.state_code,
    clicks: Math.floor(Math.random() * 100) + 20,
    hovers: Math.floor(Math.random() * 200) + 50
  }))
}

// Enhanced endpoint for PostHog webhook integration
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()
    
    // Process PostHog webhook data
    // This would typically store or process real-time events
    console.log('PostHog webhook received:', webhookData)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('PostHog webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}