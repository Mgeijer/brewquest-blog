import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import CaliforniaNewsletterEmail from '@/emails/CaliforniaNewsletterEmail'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberName = searchParams.get('name') || 'Beer Enthusiast'
    const weekOverride = searchParams.get('week')

    const emailHtml = await render(
      CaliforniaNewsletterEmail({
        subscriberName,
        previewMode: true
      })
    )

    return new NextResponse(emailHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('California newsletter preview error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate California newsletter preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}