import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'
import { getCurrentState, getStateTitle } from '@/lib/data/stateProgress'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/send-arizona-newsletter
 * Send Arizona newsletter directly with simple password protection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Simple password check
    if (password !== 'brewquest2024') {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 })
    }

    console.log(`[NEWSLETTER] Sending Arizona newsletter`)

    const supabase = createClient()
    const currentState = getCurrentState()
    const stateTitle = getStateTitle(currentState?.code || '')
    
    if (!currentState) {
      return NextResponse.json({
        success: false,
        error: 'No current state found'
      }, { status: 400 })
    }

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name')
      .eq('is_active', true)

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch subscribers'
      }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active subscribers found'
      }, { status: 404 })
    }

    console.log(`[NEWSLETTER] Found ${subscribers.length} subscribers`)

    let successful = 0
    let failed = 0

    for (const subscriber of subscribers) {
      try {
        // Generate personalized email with current state data
        const personalizedEmailHtml = await render(
          ArizonaNewsletterEmail({
            subscriberName: subscriber.first_name || 'Beer Enthusiast',
            weekNumber: currentState.weekNumber,
            unsubscribeToken: 'placeholder_token' // In production, generate actual tokens
          })
        )

        await resend.emails.send({
          from: 'Hop Harrison <hop@hopharrison.com>',
          to: subscriber.email,
          subject: `🍺 Week ${currentState.weekNumber} Complete: ${currentState.name}'s ${stateTitle}`,
          html: personalizedEmailHtml
        })
        
        successful++
        console.log(`Sent Arizona newsletter to ${subscriber.email}`)
        
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error)
        failed++
      }
    }

    console.log(`[NEWSLETTER] Arizona newsletter sent: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Arizona newsletter sent successfully`,
      results: {
        total_subscribers: subscribers.length,
        successful_sends: successful,
        failed_sends: failed,
        subject: `🍺 Week ${currentState.weekNumber} Complete: ${currentState.name}'s ${stateTitle}`,
        state: currentState.name,
        week: currentState.weekNumber
      }
    })

  } catch (error) {
    console.error('[NEWSLETTER] Send error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send newsletter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Arizona Newsletter Sending Endpoint',
    usage: 'POST with { "password": "brewquest2024" } to send newsletter',
    info: 'Sends Arizona Week 3 newsletter to all active subscribers'
  })
}