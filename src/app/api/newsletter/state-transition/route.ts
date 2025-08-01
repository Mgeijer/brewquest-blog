import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBatchEmail } from '@/lib/email/resend'
import { render } from '@react-email/render'
import StateTransitionEmail from '@/emails/StateTransitionEmail'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a valid cron request or admin request
    const { cronSecret, adminPassword } = await request.json().catch(() => ({}))
    
    if (cronSecret !== process.env.CRON_SECRET && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret or admin password' },
        { status: 401 }
      )
    }

    const supabase = createClient()

    // Get the completed state information
    const { data: completedStateData, error: completedStateError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number, status')
      .eq('status', 'completed')
      .order('week_number', { ascending: false })
      .limit(1)
      .single()

    if (completedStateError || !completedStateData) {
      console.error('Error getting completed state:', completedStateError)
      return NextResponse.json(
        { error: 'Could not determine completed state' },
        { status: 500 }
      )
    }

    // Get the new current state information
    const { data: newStateData, error: newStateError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number, status')
      .eq('status', 'current')
      .single()

    if (newStateError || !newStateData) {
      console.error('Error getting new current state:', newStateError)
      return NextResponse.json(
        { error: 'Could not determine new current state' },
        { status: 500 }
      )
    }

    // Get top beer reviews from the completed state
    const { data: topBeers, error: beerError } = await supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating')
      .eq('state_code', completedStateData.state_code)
      .order('rating', { ascending: false })
      .limit(3)

    if (beerError) {
      console.error('Error getting top beers:', beerError)
      return NextResponse.json(
        { error: 'Could not get top beers' },
        { status: 500 }
      )
    }

    // Get brewery count for completed state
    const { data: breweryCount } = await supabase
      .from('beer_reviews')
      .select('brewery_name')
      .eq('state_code', completedStateData.state_code)
      .then(({ data }) => ({
        data: [...new Set(data?.map(b => b.brewery_name) || [])].length
      }))

    // Get active subscribers
    const { data: subscribers, error: subscriberError } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name, preferences')
      .eq('is_active', true)

    if (subscriberError) {
      console.error('Error getting subscribers:', subscriberError)
      return NextResponse.json(
        { error: 'Could not get subscribers' },
        { status: 500 }
      )
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscribers found',
        stats: { total: 0, successful: 0, failed: 0 }
      })
    }

    // Generate email HTML for each subscriber with personalized unsubscribe token
    const emailsToSend = subscribers.map(subscriber => {
      const unsubscribeToken = subscriber.preferences?.unsubscribe_token || 'invalid'
      
      const emailHtml = render(StateTransitionEmail({
        subscriberName: subscriber.first_name || 'Beer Enthusiast',
        completedState: completedStateData.state_name,
        completedStateCode: completedStateData.state_code,
        completedWeek: completedStateData.week_number,
        newState: newStateData.state_name,
        newStateCode: newStateData.state_code,
        newWeek: newStateData.week_number,
        topBeers: topBeers || [],
        breweryCount: breweryCount?.data || 0,
        unsubscribeToken
      }))

      return {
        email: subscriber.email,
        name: subscriber.first_name,
        html: emailHtml
      }
    })

    // Send batch emails
    const batchResults = []
    const batchSize = 50 // Send in batches to avoid rate limits

    for (let i = 0; i < emailsToSend.length; i += batchSize) {
      const batch = emailsToSend.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async ({ email, name, html }) => {
        const subject = `🎉 ${completedStateData.state_name} Complete! Next: ${newStateData.state_name} - BrewQuest Chronicles`
        
        const { sendEmail } = await import('@/lib/email/resend')
        return sendEmail({
          to: email,
          subject,
          html
        })
      })

      try {
        const results = await Promise.all(batchPromises)
        batchResults.push(...results)
        
        // Small delay between batches
        if (i + batchSize < emailsToSend.length) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error)
        batchResults.push(...batch.map(() => ({ success: false, error: error.message })))
      }
    }

    // Calculate statistics
    const successful = batchResults.filter(r => r.success).length
    const failed = batchResults.filter(r => !r.success).length

    // Log the state transition send for analytics
    try {
      await supabase
        .from('newsletter_campaigns')
        .insert({
          campaign_type: 'state_transition',
          subject: `🎉 ${completedStateData.state_name} Complete! Next: ${newStateData.state_name} - BrewQuest Chronicles`,
          sent_at: new Date().toISOString(),
          recipient_count: subscribers.length,
          success_count: successful,
          failure_count: failed,
          state_code: newStateData.state_code, // Log as the new state
          week_number: newStateData.week_number,
          metadata: {
            completed_state: completedStateData.state_name,
            completed_state_code: completedStateData.state_code,
            completed_week: completedStateData.week_number,
            top_beer_count: topBeers?.length || 0,
            brewery_count: breweryCount?.data || 0
          }
        })
    } catch (logError) {
      console.error('Failed to log campaign:', logError)
    }

    return NextResponse.json({
      success: true,
      message: `State transition email sent: ${completedStateData.state_name} → ${newStateData.state_name}`,
      stats: {
        total: subscribers.length,
        successful,
        failed,
        completedState: completedStateData.state_name,
        newState: newStateData.state_name,
        completedWeek: completedStateData.week_number,
        newWeek: newStateData.week_number,
        topBeerCount: topBeers?.length || 0,
        breweryCount: breweryCount?.data || 0
      }
    })

  } catch (error) {
    console.error('State transition email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to preview state transition email
export async function GET() {
  try {
    const supabase = createClient()

    // Get mock data for preview
    const { data: stateData } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number')
      .order('week_number', { ascending: true })
      .limit(2)

    const currentState = stateData?.[0] || { state_name: 'Alabama', state_code: 'AL', week_number: 1 }
    const nextState = stateData?.[1] || { state_name: 'Alaska', state_code: 'AK', week_number: 2 }

    // Get some sample beer reviews for preview
    const { data: sampleBeers } = await supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating')
      .limit(3)
      .order('rating', { ascending: false })

    // Generate preview HTML
    const previewHtml = render(StateTransitionEmail({
      subscriberName: 'Preview User',
      completedState: currentState.state_name,
      completedStateCode: currentState.state_code,
      completedWeek: currentState.week_number,
      newState: nextState.state_name,
      newStateCode: nextState.state_code,
      newWeek: nextState.week_number,
      topBeers: sampleBeers || [
        { beer_name: 'Sample IPA', brewery_name: 'Sample Brewery', rating: 4.5 },
        { beer_name: 'Example Stout', brewery_name: 'Example Brewing', rating: 4.2 }
      ],
      breweryCount: 7,
      unsubscribeToken: 'preview-token'
    }))

    return new Response(previewHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('State transition preview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}