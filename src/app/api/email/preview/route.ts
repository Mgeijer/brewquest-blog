import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'

/**
 * Email Preview Endpoint
 * GET /api/email/preview?template=arizona
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const template = searchParams.get('template') || 'arizona'
  
  try {
    let emailHtml = ''
    
    switch (template.toLowerCase()) {
      case 'arizona':
        emailHtml = await render(ArizonaNewsletterEmail({
          subscriberName: 'Preview User',
          weekNumber: 3,
          previewMode: true
        }))
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid template. Available: arizona' },
          { status: 400 }
        )
    }
    
    // Return HTML for preview
    return new NextResponse(emailHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      },
    })
    
  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}