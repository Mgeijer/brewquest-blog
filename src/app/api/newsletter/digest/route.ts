import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBatchEmail } from '@/lib/email/resend'
import { render } from '@react-email/render'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'

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

    // Get current state information
    const { data: currentStateData, error: stateError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number, status')
      .eq('status', 'current')
      .single()

    if (stateError || !currentStateData) {
      console.error('Error getting current state:', stateError)
      return NextResponse.json(
        { error: 'Could not determine current state' },
        { status: 500 }
      )
    }

    // Get beer reviews for the current state
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating, beer_style, abv, day_of_week, image_url')
      .eq('state_code', currentStateData.state_code)
      .order('day_of_week', { ascending: true })

    if (beerError) {
      console.error('Error getting beer reviews:', beerError)
      return NextResponse.json(
        { error: 'Could not get beer reviews' },
        { status: 500 }
      )
    }

    // Get next state for preview
    const { data: nextStateData } = await supabase
      .from('state_progress')
      .select('state_name')
      .eq('week_number', currentStateData.week_number + 1)
      .single()

    // Get active subscribers
    const { data: subscribers, error: subscriberError } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name, preferences, subscribed_at')
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
      
      const emailHtml = render(WeeklyDigestEmail({
        subscriberName: subscriber.first_name || 'Beer Enthusiast',
        weekNumber: currentStateData.week_number,
        stateName: currentStateData.state_name,
        stateCode: currentStateData.state_code,
        beerReviews: beerReviews || [],
        breweryCount: beerReviews?.length || 0,
        nextStateName: nextStateData?.state_name,
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
        const subject = `Week ${currentStateData.week_number} Complete: ${currentStateData.state_name} Craft Beer Journey`
        
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

    // Log the digest send for analytics
    try {
      await supabase
        .from('newsletter_campaigns')
        .insert({
          campaign_type: 'weekly_digest',
          subject: `Week ${currentStateData.week_number} Complete: ${currentStateData.state_name} Craft Beer Journey`,
          sent_at: new Date().toISOString(),
          recipient_count: subscribers.length,
          success_count: successful,
          failure_count: failed,
          state_code: currentStateData.state_code,
          week_number: currentStateData.week_number,
          metadata: {
            beer_count: beerReviews?.length || 0,
            next_state: nextStateData?.state_name
          }
        })
    } catch (logError) {
      console.error('Failed to log campaign:', logError)
    }

    return NextResponse.json({
      success: true,
      message: `Weekly digest sent for ${currentStateData.state_name}`,
      stats: {
        total: subscribers.length,
        successful,
        failed,
        state: currentStateData.state_name,
        week: currentStateData.week_number,
        beerCount: beerReviews?.length || 0
      }
    })

  } catch (error) {
    console.error('Weekly digest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to preview digest email
export async function GET() {
  try {
    const supabase = createClient()

    // Get current state information
    const { data: currentStateData } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number')
      .eq('status', 'current')
      .single()

    // Get beer reviews for the current state
    const { data: beerReviews } = await supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating, beer_style, abv, day_of_week')
      .eq('state_code', currentStateData?.state_code || 'AL')
      .order('day_of_week', { ascending: true })

    // Get next state for preview
    const { data: nextStateData } = await supabase
      .from('state_progress')
      .select('state_name')
      .eq('week_number', (currentStateData?.week_number || 1) + 1)
      .single()

    // Generate preview HTML
    const previewHtml = render(WeeklyDigestEmail({
      subscriberName: 'Preview User',
      weekNumber: currentStateData?.week_number || 1,
      stateName: currentStateData?.state_name || 'Alabama',
      stateCode: currentStateData?.state_code || 'AL',
      beerReviews: beerReviews || [],
      breweryCount: beerReviews?.length || 0,
      nextStateName: nextStateData?.state_name
    }))

    return new Response(previewHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Digest preview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}