import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send test newsletter to specific email
 */
export async function POST(request: NextRequest) {
  try {
    console.log(`[TEST] Sending Arizona newsletter test email`)

    // Generate Arizona newsletter
    const emailHtml = await render(
      ArizonaNewsletterEmail({
        subscriberName: 'Martin',
        weekNumber: 3,
        previewMode: false
      })
    )

    await resend.emails.send({
      from: 'Hop Harrison <hop@hopharrison.com>',
      to: 'martingeijer@gmail.com',
      subject: '🍺 Week 3 Complete: Arizona\'s Desert Brewing Renaissance',
      html: emailHtml
    })
    
    console.log(`Test Arizona newsletter sent to martingeijer@gmail.com`)

    return NextResponse.json({
      success: true,
      message: 'Test newsletter sent to martingeijer@gmail.com',
      subject: '🍺 Week 3 Complete: Arizona\'s Desert Brewing Renaissance'
    })

  } catch (error) {
    console.error('[TEST] Send error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send test newsletter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test newsletter endpoint',
    info: 'POST to send Arizona newsletter to martingeijer@gmail.com'
  })
}