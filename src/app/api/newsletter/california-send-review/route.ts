import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import CaliforniaNewsletterEmail from '@/emails/CaliforniaNewsletterEmail'
import { sendEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    console.log('Generating California newsletter for review...')

    const emailHtml = await render(
      CaliforniaNewsletterEmail({
        subscriberName: 'Martin',
        previewMode: false
      })
    )

    console.log('California newsletter HTML generated, length:', emailHtml.length)

    // Send to Martin's email for review
    const result = await sendEmail({
      to: 'martingeijer@gmail.com',
      subject: '📧 REVIEW: California Weekly Newsletter - Week 5 BrewQuest Chronicles',
      html: emailHtml
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'California newsletter sent to martingeijer@gmail.com for review',
        emailLength: emailHtml.length
      })
    } else {
      throw new Error(result.error || 'Failed to send email')
    }

  } catch (error) {
    console.error('California newsletter review send error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send California newsletter for review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}