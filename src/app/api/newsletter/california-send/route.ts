import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { render } from '@react-email/render'
import CaliforniaNewsletterEmail from '@/emails/CaliforniaNewsletterEmail'
import { sendEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a valid admin request
    const { adminPassword } = await request.json().catch(() => ({}))
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin password' },
        { status: 401 }
      )
    }

    console.log('Starting California newsletter distribution...')

    const supabase = createClient()

    // Get all active subscribers
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

    console.log(`Found ${subscribers.length} active subscribers`)

    // Generate emails for each subscriber
    const emailsToSend = []
    for (const subscriber of subscribers) {
      const unsubscribeToken = subscriber.preferences?.unsubscribe_token || 'invalid'
      
      const emailHtml = await render(
        CaliforniaNewsletterEmail({
          subscriberName: subscriber.first_name || 'Beer Enthusiast',
          unsubscribeToken,
          previewMode: false
        })
      )

      emailsToSend.push({
        email: subscriber.email,
        name: subscriber.first_name,
        html: emailHtml
      })
    }

    // Send batch emails
    const batchResults = []
    const batchSize = 50 // Send in batches to avoid rate limits

    for (let i = 0; i < emailsToSend.length; i += batchSize) {
      const batch = emailsToSend.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async ({ email, name, html }) => {
        const subject = '🍺 Week 5: California\'s Golden State Brewing Excellence - BrewQuest Chronicles'
        
        return sendEmail({
          to: email,
          subject,
          html
        })
      })

      try {
        const results = await Promise.all(batchPromises)
        batchResults.push(...results)
        
        console.log(`Batch ${Math.floor(i / batchSize) + 1} completed: ${results.filter(r => r.success).length}/${results.length} successful`)
        
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

    console.log(`California newsletter distribution complete: ${successful}/${subscribers.length} successful`)

    // Log the campaign
    try {
      await supabase
        .from('newsletter_campaigns')
        .insert({
          campaign_type: 'weekly_state',
          subject: '🍺 Week 5: California\'s Golden State Brewing Excellence - BrewQuest Chronicles',
          sent_at: new Date().toISOString(),
          recipient_count: subscribers.length,
          success_count: successful,
          failure_count: failed,
          state_code: 'CA',
          week_number: 5,
          metadata: {
            state_name: 'California',
            breweries_featured: 7,
            campaign_theme: 'Golden State Brewing Excellence'
          }
        })
    } catch (logError) {
      console.error('Failed to log campaign:', logError)
    }

    return NextResponse.json({
      success: true,
      message: `California newsletter sent to ${subscribers.length} subscribers`,
      stats: {
        total: subscribers.length,
        successful,
        failed,
        state: 'California',
        week: 5
      }
    })

  } catch (error) {
    console.error('California newsletter distribution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}