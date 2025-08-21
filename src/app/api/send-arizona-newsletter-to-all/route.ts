import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Send Arizona newsletter to all active subscribers
 */
export async function POST(request: NextRequest) {
  try {
    console.log(`[ARIZONA] Sending Arizona newsletter to all subscribers`)

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name, preferences')
      .eq('is_active', true)

    if (subscribersError) {
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`)
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active subscribers found'
      }, { status: 404 })
    }

    console.log(`[ARIZONA] Found ${subscribers.length} active subscribers`)

    let successful = 0
    let failed = 0
    const failedEmails: string[] = []

    // Send Arizona newsletter to each subscriber
    for (const subscriber of subscribers) {
      try {
        // Skip if subscriber opted out of weekly digest
        if (subscriber.preferences?.weekly_digest === false) {
          console.log(`[ARIZONA] Skipping ${subscriber.email} - opted out of weekly digest`)
          continue
        }

        const subscriberName = subscriber.first_name && subscriber.first_name.trim() 
          ? subscriber.first_name.trim() 
          : 'Beer Enthusiast'

        // Generate Arizona newsletter
        const emailHtml = await render(
          ArizonaNewsletterEmail({
            subscriberName,
            weekNumber: 3,
            previewMode: false,
            unsubscribeToken: subscriber.preferences?.unsubscribe_token
          })
        )

        await resend.emails.send({
          from: 'Hop Harrison <hop@hopharrison.com>',
          to: subscriber.email,
          subject: '🍺 Week 3 Complete: Arizona\'s Desert Brewing Renaissance',
          html: emailHtml
        })

        successful++
        console.log(`[ARIZONA] Sent to ${subscriber.email}`)

      } catch (error) {
        failed++
        failedEmails.push(subscriber.email)
        console.error(`[ARIZONA] Failed to send to ${subscriber.email}:`, error)
      }
    }

    // Log campaign analytics
    try {
      await supabase
        .from('newsletter_campaigns')
        .insert({
          campaign_type: 'arizona_newsletter',
          subject: '🍺 Week 3 Complete: Arizona\'s Desert Brewing Renaissance',
          recipient_count: subscribers.length,
          success_count: successful,
          failure_count: failed,
          state_code: 'AZ',
          week_number: 3,
          sent_at: new Date().toISOString(),
          metadata: {
            template_version: 'improved_contrast',
            newsletter_type: 'state_specific'
          }
        })
    } catch (logError) {
      console.error('[ARIZONA] Failed to log campaign:', logError)
    }

    console.log(`[ARIZONA] Newsletter campaign complete: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Arizona newsletter sent successfully`,
      stats: {
        successful,
        failed,
        total: subscribers.length,
        skipped: subscribers.length - successful - failed
      },
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined
    })

  } catch (error) {
    console.error('[ARIZONA] Send error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send Arizona newsletter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Arizona newsletter sender endpoint',
    info: 'POST to send improved Arizona newsletter to all active subscribers'
  })
}